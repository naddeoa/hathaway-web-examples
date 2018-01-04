import { createModel, ImmutableModel } from 'hathaway-core';
import { List } from 'immutable';

export type CountModel = {
    count: number;
    history: List<ImmutableModel<CountModel>>
};

const defaultValues = {
    count: 0,
    history: List([])
};

export type Model = ImmutableModel<CountModel>;

export const initialValue: Model = createModel(defaultValues);
