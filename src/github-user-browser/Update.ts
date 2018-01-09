import { ImmutableModel, Cmd, NoOp, pipe, f } from 'hathaway';
import Msg from './Msg';
import { MyModel, addUserProfile, addRepos, currentlyFetching, setCurrentlyFetching, lookupUserProfile, addProgammingLanguages, lookupRepos, RepoModel, modelSet } from './Model';
import { getUserProfile, getUserRepos, UserProfile, Repo, getProgrammingLangugesForRepos, ProgrammingLanguages } from './GithubApi';
import { createPath, Route } from './Routes';

export default function update(model: ImmutableModel<MyModel>, msg: Msg): [ImmutableModel<MyModel>, Cmd<MyModel, Msg>] {

    switch (msg.type) {
        case 'OnUsernameSearch':
            const username = model.get('usernameSearchText');


            if (msg.pushInHistory) {
                const newRoute: Route = { type: 'UserRoute', user: username };
                window.history.pushState(newRoute, document.title, createPath(newRoute));
            }

            // Don't refetch if we already have what we need
            if (model.get('userProfiles').has(username) &&
                lookupUserProfile(username, model) !== null) {
                return [model.set('showProfile', username), NoOp];
            }

            const asyncUpdate: Cmd<MyModel, Msg> = {
                type: 'AsyncCmd',
                promise: getUserProfile(username).catch(_reason => {
                    alert("Can't find user " + username);
                    return null;
                }),
                successFunction: (dispatch, newModelState, result: UserProfile | null) => {
                    // If we couldn't get the user then we're not going to be showing anything
                    if (result === null) {
                        return [newModelState.set('showProfile', null), NoOp];
                    }

                    const updatedModel = pipe(newModelState,
                        f(addUserProfile, username, result),
                        f(modelSet, 'showProfile', username),
                        f(setCurrentlyFetching, username, false));

                    // Request the repos next
                    const profileModel = lookupUserProfile(username, updatedModel);
                    profileModel && dispatch({ type: 'FetchReposForUser', user: profileModel });

                    return [updatedModel, NoOp];
                }
            }

            const updatedModel = pipe(model,
                f(setCurrentlyFetching, username, true),
                f(modelSet, 'showProfile', username));

            return [updatedModel, asyncUpdate];

        case 'OnUsernameSearchChanged':
            return [model.set('usernameSearchText', msg.text), NoOp];

        case 'FetchLanguagesForRepo':

            const languagesUpdate: Cmd<MyModel, Msg> = {
                type: 'AsyncCmd',
                promise: getProgrammingLangugesForRepos(msg.repo),
                successFunction: (_dispatch, newModelState, result: ProgrammingLanguages | null) => {
                    if (result === null) {
                        return [newModelState, NoOp];
                    }

                    return [addProgammingLanguages(msg.repo, result, newModelState), NoOp];
                },
                errorFunction: (_dispatch, _newModelState, err: string) => {
                    console.log(`Can't find programming languages for repo ${msg.repo.get('name')}: ${err}`);
                }

            }
            return [model, languagesUpdate];

        case 'FetchReposForUser':
            if (currentlyFetching(msg.user, model)) {
                // Already a request happening
                return [model, NoOp];
            }

            const reposUpdate: Cmd<MyModel, Msg> = {
                type: 'AsyncCmd',
                promise: getUserRepos(msg.user),
                successFunction: (dispatch, newModelState, result: Repo[] | null) => {
                    const updatedModel = setCurrentlyFetching(msg.user, false, newModelState);
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
                },
                errorFunction: (_dispatch, _newModelState, reason: string) => {
                    alert(`Can't get repos for user ${model.get('usernameSearchText')}: ${reason}`);
                }
            }

            return [setCurrentlyFetching(msg.user, true, model), reposUpdate];

        case 'Navigate':
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
