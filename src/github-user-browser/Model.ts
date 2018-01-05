import { createModel, ImmutableModel, Cmd, NoOp, Dispatch } from 'hathaway-core';
import { Map, List } from 'immutable';
import { UserProfile, Repo, ProgrammingLanguages } from './GithubApi';
import { parseRoute } from './Routes';
import Msg from './Msg';

export function addUserProfile(username: string, profile: UserProfile, model: ImmutableModel<MyModel>): ImmutableModel<MyModel> {
    return model.set('userProfiles', model.get('userProfiles').set(username, createModel(profile)));
}

export function lookupUserProfile(username: string, model: ImmutableModel<MyModel>): UserProfileModel | null {
    const profile = model.get('userProfiles').get(username)

    if (!profile) {
        return null;
    }

    return profile;
}

export function currentlyFetchingRepos(profile: UserProfileModel, model: ImmutableModel<MyModel>): boolean {
    const fetching = model.get('fetchingReposForProfile').get(profile.get('id'));
    if (!fetching) {
        return false;
    }

    return fetching;
}

export function setCurrentlyFetchingRepos(profile: UserProfileModel, fetching: boolean, model: ImmutableModel<MyModel>): ImmutableModel<MyModel> {
    const fetchingStatus = model.get('fetchingReposForProfile').set(profile.get('id'), fetching);
    return model.set('fetchingReposForProfile', fetchingStatus);
}

export function addRepos(profile: UserProfileModel, repos: Repo[], model: ImmutableModel<MyModel>): ImmutableModel<MyModel> {
    const updatedRepos = model.get('repos').set(profile.get('id'), List(repos.map(createModel)));
    return model.set('repos', updatedRepos);
}

export function lookupRepos(profile: UserProfileModel, model: ImmutableModel<MyModel>): ReposModel | null {
    // TODO make this one line
    const repos = model.get('repos').get(profile.get('id'));

    if (!repos) {
        return null;
    }

    return repos;
}

export function addProgammingLanguages(repo: RepoModel, languages: ProgrammingLanguages, model: ImmutableModel<MyModel>): ImmutableModel<MyModel> {
    const updatedProgrammingLanguagesModel = model.get('programmingLanguages').set(repo.get('id'), Map(languages));
    return model.set('programmingLanguages', updatedProgrammingLanguagesModel);
}

export function lookupProgrammingLanguagesModel(repo: RepoModel, model: ImmutableModel<MyModel>): ProgrammingLanguagesModel | null {
    return model.get('programmingLanguages').get(repo.get('id')) || null;
}

export type UserProfileModel = ImmutableModel<UserProfile>;

export type RepoModel = ImmutableModel<Repo>;

export type ReposModel = List<RepoModel>;

export type ProgrammingLanguagesModel = Map<string, number>;

export type MyModel = {
    usernameSearchText: string,
    showProfile: string | null,
    userProfiles: Map<string, UserProfileModel>,
    repos: Map<string, ReposModel>,
    fetchingReposForProfile: Map<string, boolean>,
    programmingLanguages: Map<string, ProgrammingLanguagesModel>
};


const initialRoute = parseRoute();
console.log(initialRoute);

const defaultValues: MyModel = {
    usernameSearchText: initialRoute.type === 'UserRoute' ? initialRoute.user : '',
    showProfile: initialRoute.type === 'UserRoute' ? initialRoute.user : null,
    userProfiles: Map<string, UserProfileModel>(),
    repos: Map<string, ReposModel>(),
    fetchingReposForProfile: Map<string, boolean>(),
    programmingLanguages: Map<string, Map<string, number>>()
};

export type Model = ImmutableModel<MyModel>;

const initialValue: Model = createModel(defaultValues);

function getInitialCmd(): Cmd<MyModel, Msg> {
    if (defaultValues.showProfile === null) {
        return NoOp;
    }

    const cmd: Cmd<MyModel, Msg> = {
        type: 'AsyncCmd',
        promise: Promise.resolve(),
        successFunction: (dispatch: Dispatch<Msg>, model: Model, _result: null) => {
            dispatch({ type: 'OnUsernameSearch', pushInHistory: true});
            return [model, NoOp];
        }
    };

    return cmd;
}

export const init: [ImmutableModel<MyModel>, Cmd<MyModel, Msg>] = [initialValue, getInitialCmd()]
