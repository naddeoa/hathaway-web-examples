import { ViewProps } from 'hathaway';
import * as React from 'react';

import { currentlyFetching, lookupRepos, lookupUserProfile, MyModel } from '../Model';
import Msg from '../Msg';
import Repos from './Repos';
import SearchBox from './SearchBox';
import UserProfile from './UserProfile';

const UserPage: React.SFC<ViewProps<MyModel, Msg, {}>> = ({ model, dispatch }: ViewProps<MyModel, Msg, {}>) => {
    const username = model.get('showProfile');
    const currentlyFetchingUserProfile = username === null ? false : currentlyFetching(username, model);
    const profile = username === null ? null : lookupUserProfile(username, model);

    const currentlyFetchingRepos = profile === null ? false : currentlyFetching(profile, model)
    const repos = profile === null ? null : lookupRepos(profile, model);
    const languages = model.get('programmingLanguages');

    return (
        <div className="root">
            <SearchBox username={model.get('usernameSearchText')} dispatch={dispatch} />
            <UserProfile isFetching={currentlyFetchingUserProfile} username={username} profile={profile} />
            <Repos username={username} isFetching={currentlyFetchingRepos} repos={repos} profile={profile} languages={languages} />
        </div>
    );
}

export default UserPage;
