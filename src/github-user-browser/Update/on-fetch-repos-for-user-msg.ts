import { asyncCmd, CmdResultArgs, f, ImmutableModel, pipe, UpdateResult } from 'hathaway';
import { getUserRepos, ProgrammingLanguages, Repo } from '../GithubApi';
import {
    addRepos,
    currentlyFetching,
    lookupRepos,
    MyModel,
    RepoModel,
    setCurrentlyFetching,
    UserProfileModel,
} from '../Model';
import Msg, { FetchReposForUser } from '../Msg';

function successFunction(user: UserProfileModel, { model, result, dispatch }: CmdResultArgs<MyModel, Msg, Repo[]>) {

    const updatedModel = pipe(model,
        f(setCurrentlyFetching, user, false),
        f(addRepos, user, result || [])
    );

    lookupRepos(user, updatedModel).forEach((repo: RepoModel | undefined) => {
        repo && dispatch({ type: 'FetchLanguagesForRepo', repo })
    });

    return { model: updatedModel };
}

function errorFunction(searchText: string, { result }: CmdResultArgs<MyModel, Msg, ProgrammingLanguages>) {
    alert(`Can't get repos for user ${searchText}: ${result}`);
    return null;
}

export function onFetchReposForUser(model: ImmutableModel<MyModel>, msg: FetchReposForUser): UpdateResult<MyModel, Msg> {

    if (currentlyFetching(msg.user, model)) {
        // Already a request happening
        return { model };
    }

    const cmd = asyncCmd(getUserRepos(msg.user), f(successFunction, msg.user), f(errorFunction, model.get('usernameSearchText')))
    return { model: setCurrentlyFetching(msg.user, true, model), cmd };
}