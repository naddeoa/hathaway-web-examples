import * as React from 'react';
import { ViewProps, Dispatch } from 'hathaway-core';
import { CountModel } from './Model';
import Msg from './Msg';

const increment = (dispatch: Dispatch<Msg>) => () => {
    dispatch({ type: 'Increment' });
}

const decrement = (dispatch: Dispatch<Msg>) => () => {
    dispatch({ type: 'Decrement' });
}

const undo = (dispatch: Dispatch<Msg>) => () => {
    dispatch({ type: 'Undo' });
}

const View: React.SFC<ViewProps<CountModel, Msg, {}>> = ({ model, dispatch }: ViewProps<CountModel, Msg, {}>) => {
    return (
        <div>
            <span>Current count: {model.get('count')}</span>
            <br />
            <button onClick={increment(dispatch)}>Increment</button>
            <button onClick={decrement(dispatch)}>Decrement</button>

            <div>
                <button onClick={undo(dispatch)}>Undo</button>
            </div>
        </div>
    );
}

export default View;