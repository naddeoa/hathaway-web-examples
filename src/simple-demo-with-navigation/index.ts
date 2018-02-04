import { start, Program, Dispatch } from 'hathaway';
import { initialValue, CountModel } from './Model';
import Msg from './Msg';
import update from './Update';
import View from './View';

const el = document.getElementById('react-root');

if (el) {
    const program: Program<CountModel, Msg> = {
        init: initialValue,
        update,
        view: View,
        dev: true,
        setupCallbacks: function (dispatch: Dispatch<Msg>) {
            window.onpopstate = (event: PopStateEvent) => dispatch({ type: 'NavigationEvent', event });
        }
    };

    start(el, program);
}
