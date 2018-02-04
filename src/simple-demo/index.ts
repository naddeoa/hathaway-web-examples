import { start, Program } from 'hathaway';
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
        dev: true
    };

    start(el, program);
}
