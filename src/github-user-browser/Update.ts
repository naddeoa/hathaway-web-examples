import { ImmutableModel, Cmd, NoOp } from 'hathaway-core';
import Msg from './Msg';
import { MyModel, addUserProfile, addRepos, currentlyFetchingRepos, setCurrentlyFetchingRepos, lookupUserProfile, addProgammingLanguages, lookupRepos, RepoModel } from './Model';
import { getUserProfile, getUserRepos, UserProfile, Repo, getProgrammingLangugesForRepos, ProgrammingLanguages } from './GithubApi';
import { createPath, Route } from './Routes';


export default function update(model: ImmutableModel<MyModel>, msg: Msg): [ImmutableModel<MyModel>, Cmd<MyModel, Msg>] {

    switch (msg.type) {
        case 'OnUsernameSearch':
            // Don't refetch if we already have what we need
            if (model.get('userProfiles').has(model.get('usernameSearchText')) &&
                lookupUserProfile(model.get('usernameSearchText'), model) !== null) {
                return [model.set('showProfile', model.get('usernameSearchText')), NoOp];
            }



            const asyncUpdate: Cmd<MyModel, Msg> = {
                type: 'AsyncCmd',
                promise: getUserProfile(model.get('usernameSearchText')).catch(_reason => {
                    alert("Can't find user " + model.get('usernameSearchText'));
                    return null;
                }),
                successFunction: (dispatch, newModelState, result: UserProfile | null) => {
                    let username = model.get('usernameSearchText');

                    if (msg.pushInHistory) {
                        const newRoute: Route = { type: 'UserRoute', user: username };
                        window.history.pushState(newRoute, document.title, createPath(newRoute));
                    }

                    // If we couldn't get the user then we're not going to be showing anything
                    if (result === null) {
                        return [newModelState.set('showProfile', null), NoOp];
                    }

                    const updatedModel = addUserProfile(username, result, newModelState).set('showProfile', username);
                    // Request the repos next
                    const profileModel = lookupUserProfile(username, updatedModel);
                    profileModel && dispatch({ type: 'FetchReposForUser', user: profileModel });
                    return [updatedModel, NoOp];
                }
            }

            return [model, asyncUpdate];

        case 'OnUsernameSearchChanged':
            return [model.set('usernameSearchText', msg.text), NoOp];

        case 'FetchLanguagesForRepo':

            const languagesUpdate: Cmd<MyModel, Msg> = {
                type: 'AsyncCmd',
                promise: getProgrammingLangugesForRepos(msg.repo).catch(err => {
                    console.log(`Can't find programming languages for repo ${msg.repo.get('name')}: ${err}`);
                    return null;
                }),
                successFunction: (_dispatch, newModelState, result: ProgrammingLanguages | null) => {
                    if (result === null) {
                        return [newModelState, NoOp];
                    }

                    return [addProgammingLanguages(msg.repo, result, newModelState), NoOp];
                }

            }
            return [model, languagesUpdate];

        case 'FetchReposForUser':
            if (currentlyFetchingRepos(msg.user, model)) {
                // Already a request happening
                return [model, NoOp];
            }

            const reposUpdate: Cmd<MyModel, Msg> = {
                type: 'AsyncCmd',
                promise: getUserRepos(msg.user).catch(reason => {
                    alert(`Can't get repos for user ${model.get('usernameSearchText')}: ${reason}`);
                    return null;
                }),
                successFunction: (dispatch, newModelState, result: Repo[] | null) => {
                    const updatedModel = setCurrentlyFetchingRepos(msg.user, false, newModelState);
                    if (result === null) {
                        return [addRepos(msg.user, [], updatedModel), NoOp];
                    }

                    // TODO Naming is clearly a problem here
                    const finalModel = addRepos(msg.user, result, updatedModel);
                    // Trigger requests for each of the languages breakdowns for each repo
                    const repoModels = lookupRepos(msg.user, finalModel);
                    repoModels && repoModels.forEach((repo: RepoModel | undefined) => {
                        // TODO why does immutable make the argument potentially undefined?
                        repo && dispatch({ type: 'FetchLanguagesForRepo', repo })
                    });

                    return [finalModel, NoOp];
                }
            }

            return [setCurrentlyFetchingRepos(msg.user, true, model), reposUpdate];

        case 'NavigateBack':
            if (msg.route === null) {
                return [model.set('showProfile', '').set('usernameSearchText', ''), NoOp];
            }

            switch (msg.route.type) {
                case 'SearchRoute':
                    return [model.set('showProfile', '').set('usernameSearchText', ''), NoOp];
                case 'UserRoute':
                    return update(model.set('showProfile', msg.route.user).set('usernameSearchText', msg.route.user), { type: 'OnUsernameSearch', pushInHistory: false });
                case 'UnknownRoute':
                    return [model.set('showProfile', '').set('usernameSearchText', ''), NoOp];
                default:
                    throw 'Never happens';
            }

    }
}
