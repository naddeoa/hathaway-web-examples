import { ImmutableModel, UpdateResult } from 'hathaway';

import { MyModel } from '../Model';
import Msg from '../Msg';
import { onFetchLanguages } from './on-fetch-languages-msg';
import { onFetchReposForUser } from './on-fetch-repos-for-user-msg';
import { onUsernameSearch } from './on-username-search-msg';

export default function update(model: ImmutableModel<MyModel>, msg: Msg): UpdateResult<MyModel, Msg> {

    switch (msg.type) {
        case 'OnUsernameSearch':
            return onUsernameSearch(model, msg);

        case 'OnUsernameSearchChanged':
            return { model: model.set('usernameSearchText', msg.text) };

        case 'FetchLanguagesForRepo':
            return onFetchLanguages(model, msg);

        case 'FetchReposForUser':
            return onFetchReposForUser(model, msg);

        case 'Navigate':
            if (msg.route === null) {
                return { model: model.set('showProfile', '').set('usernameSearchText', '') };
            }

            switch (msg.route.type) {
                case 'SearchRoute':
                    return { model: model.set('showProfile', '').set('usernameSearchText', '') };
                case 'UserRoute':
                    return update(model.set('showProfile', msg.route.user).set('usernameSearchText', msg.route.user), { type: 'OnUsernameSearch', pushInHistory: false });
                case 'UnknownRoute':
                    return { model: model.set('showProfile', '').set('usernameSearchText', '') };
                default:
                    throw 'Never happens';
            }

    }
}
