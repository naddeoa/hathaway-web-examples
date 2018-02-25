import { ImmutableModel, UpdateResult } from 'hathaway';
import { CountModel } from './Model';
import Msg from './Msg';

function saveState(model: ImmutableModel<CountModel>): ImmutableModel<CountModel> {
    return model.set('history', model.get('history').unshift(model));
}

function popState(model: ImmutableModel<CountModel>): ImmutableModel<CountModel> {
    return model.get('history').first() || model;
}

export default function update(model: ImmutableModel<CountModel>, msg: Msg): UpdateResult<CountModel, Msg> {
    switch (msg.type) {
        case 'Increment':
            return { model: saveState(model).set('count', model.get('count') + 1) };
        case 'Decrement':
            if (model.get('count') !== 0) {
                return { model: saveState(model).set('count', model.get('count') - 1) };
            } else {
                return { model };
            }
        case 'Undo':
            return { model: popState(model) };
    }
}
