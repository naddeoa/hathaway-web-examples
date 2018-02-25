import * as React from 'react';

import { UserProfileModel } from '../Model';

function UserStats({ profile }: { profile: UserProfileModel }) {
    return (
        <div>
            <ul>
                <li>id: {profile.get('id')}</li>
                <li>Github page: <a href={profile.get('html_url')} target='_blank'> {profile.get('html_url')} </a></li>
                <li>Number of followers: {profile.get('followers')}</li>
                <li>Number of gists: {profile.get('public_gists')}</li>
                <li>Number of repos: {profile.get('public_repos')}</li>
            </ul>
        </div>
    );
}

export type Props = {
    username: string | null,
    isFetching: boolean,
    profile: UserProfileModel | null
}

const View: React.SFC<Props> = ({ username, isFetching, profile }: Props) => {
    if (username === null) {
        return <div>Try to search for a github username</div>;
    }

    if (isFetching) {
        return <div>Fetching user...</div>;
    }

    if (profile === null) {
        return (
            <div>Can't find user {username}</div>
        );
    }

    return (
        <div className="user-profile-container">
            <img className="user-profile-img" src={profile.get('avatar_url')} />
            <UserStats profile={profile} />
        </div>
    );
}

export default View;