import { Program, Dispatch } from 'hathaway-core';
import { start } from 'hathaway';
import { init, MyModel } from './Model';
import Msg from './Msg';
import update from './Update';
import View from './View';

const el = document.getElementById('react-root');

if (el) {
    const program: Program<MyModel, Msg> = {
        init,
        update,
        view: View,
        renderTarget: el,
        dev: true,
        setupCallbacks: function (dispatch: Dispatch<Msg>) {
            window.onpopstate = (event: PopStateEvent) => dispatch({ type: 'NavigateBack', route: event.state });
        }
    };

    start(program);
}
