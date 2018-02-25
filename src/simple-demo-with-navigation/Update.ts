import { ImmutableModel, UpdateResult } from 'hathaway';
import { CountModel } from './Model';
import Msg from './Msg';

function goToPage(model: ImmutableModel<CountModel>, path: string): ImmutableModel<CountModel> {
    window.history.pushState(null, document.title, path);
    return model.set('pathname', path);
}

export default function update(model: ImmutableModel<CountModel>, msg: Msg): UpdateResult<CountModel, Msg> {
    switch (msg.type) {
        case 'Navigate':
            return { model: goToPage(model, msg.path) };

        case 'NavigationEvent':
            return { model: model.set('pathname', document.location.pathname) }

    }
}
