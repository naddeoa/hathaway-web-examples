import { asyncCmd, CmdResultArgs, f, ImmutableModel, UpdateResult } from 'hathaway';
import { getProgrammingLangugesForRepos, ProgrammingLanguages } from '../GithubApi';
import { addProgammingLanguages, MyModel, RepoModel } from '../Model';
import Msg, { FetchLanguagesForRepo } from '../Msg';


function successFunction(repo: RepoModel, { model, result }: CmdResultArgs<MyModel, Msg, ProgrammingLanguages>) {
    return result === null ? null : { model: addProgammingLanguages(repo, result, model) }
}

function errorFunction(repo: RepoModel, { result }: CmdResultArgs<MyModel, Msg, ProgrammingLanguages>) {
    console.log(`Can't find programming languages for repo ${repo.get('name')}: ${result}`);
    return null;
}

export function onFetchLanguages(model: ImmutableModel<MyModel>, msg: FetchLanguagesForRepo): UpdateResult<MyModel, Msg> {
    const cmd = asyncCmd(getProgrammingLangugesForRepos(msg.repo), f(successFunction, msg.repo), f(errorFunction, msg.repo));
    return { model, cmd };
}