import { apply, asyncCmd, CmdResultArgs, f, ImmutableModel, pipe, UpdateResult } from 'hathaway';
import { getUserProfile, UserProfile } from '../GithubApi';
import { addUserProfile, lookupUserProfile, modelSet, MyModel, setCurrentlyFetching } from '../Model';
import Msg, { OnUsernameSearch } from '../Msg';
import { createPath, Route } from '../Routes';

function successFunction(originalModelState: ImmutableModel<MyModel>, { dispatch, model, result }: CmdResultArgs<MyModel, Msg, UserProfile>) {
    // If we couldn't get the user then we're not going to be showing anything
    if (result === null) {
        return null;
    }

    const username = originalModelState.get('usernameSearchText');
    const updatedModel = apply(model,
        [f(addUserProfile, username, result),
        f(modelSet, 'showProfile', username),
        f(setCurrentlyFetching, username, false)]);

    // Request the repos next
    const profileModel = lookupUserProfile(username, updatedModel);
    profileModel && dispatch({ type: 'FetchReposForUser', user: profileModel });

    return { model: updatedModel };
}

function errorFunction(username: String, _args: CmdResultArgs<MyModel, Msg, UserProfile>) {
    alert("Can't find user " + username);
    return null;
}

export function onUsernameSearch(model: ImmutableModel<MyModel>, msg: OnUsernameSearch): UpdateResult<MyModel, Msg> {
    const username = model.get('usernameSearchText');

    if (msg.pushInHistory) {
        const newRoute: Route = { type: 'UserRoute', user: username };
        window.history.pushState(newRoute, document.title, createPath(newRoute));
    }

    // Don't refetch if we already have what we need
    if (model.get('userProfiles').has(username) && lookupUserProfile(username, model) !== null) {
        return { model: model.set('showProfile', username) };
    }

    const updatedModel = pipe(model,
        f(setCurrentlyFetching, username, true),
        f(modelSet, 'showProfile', username));

    return { model: updatedModel, cmd: asyncCmd(getUserProfile(username), f(successFunction, model), f(errorFunction, username)) };
}