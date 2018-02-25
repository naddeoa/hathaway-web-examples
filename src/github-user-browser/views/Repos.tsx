import { Map } from 'immutable';
import * as React from 'react';

import { ProgrammingLanguagesModel, RepoModel, ReposModel, UserProfileModel } from '../Model';

function ProgrammingLanguagesView({ languages, repo }: { languages: ProgrammingLanguagesModel | null, repo: RepoModel }) {
    if (languages === null) {
        return null;
    }

    const languagesUsed: string = languages.reduce(function (reduction, numberOfLines, languageName) {
        const summary = `${languageName}: ${numberOfLines}`;
        if (reduction !== '') {
            return `${reduction}, ${summary}`;
        }
        return summary;
    }, '');

    return (
        <p key={`${repo.get('id')}-languages`} >{languagesUsed}</p>
    );
}


interface RepoViewProps {
    languages: Map<string, ProgrammingLanguagesModel>,
    repo?: RepoModel
}

function RepoView({ repo, languages }: RepoViewProps) {
    if (!repo) {
        return null;
    }

    const languageData = languages.get(repo.get('id')) || null;

    return (
        <div className='repo'>
            <a target='_blank' href={repo.get('html_url')}> <h2>{repo.get('name')}</h2></a>
            <ProgrammingLanguagesView languages={languageData} repo={repo} />
            <p>{repo.get('description')}</p>
            <ul>
                {repo.get('fork') && <li className='fork'>fork</li>}
                <li>Number of forks: {repo.get('forks_count')}</li>
                <li>Number of open issues: {repo.get('open_issues_count')}</li>
                <li>Number of watchers: {repo.get('watchers')}</li>
            </ul>
        </div>
    );
}

export interface Props {
    username: string | null,
    profile: UserProfileModel | null,
    isFetching: boolean,
    repos: ReposModel | null,
    languages: Map<string, ProgrammingLanguagesModel>
}

const View: React.SFC<Props> = ({ username, isFetching, repos, profile, languages }: Props) => {
    if (username === null) {
        return null;
    }

    if (profile === null) {
        return null;
    }

    if (repos === null && !isFetching) {
        return (
            <div>Fetchign repos... {username}</div>
        );
    }

    if (repos === null) {
        return <div>Can't get the repos for {username}</div>
    }

    if (repos.size === 0) {
        return <div>No repos</div>;
    }

    return (
        <div className='repositories'>
            <h1>Repositories</h1>
            {repos.map(repo => <RepoView repo={repo} languages={languages} key={repo === undefined ? 'remove-when-immutable4-released' : repo.get('id')} />)}
        </div>
    );
}

export default View;