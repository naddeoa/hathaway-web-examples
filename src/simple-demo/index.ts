import { Program } from 'hathaway';
import { start } from 'hathaway';
import { initialValue, CountModel } from './Model';
import Msg from './Msg';
import update from './Update';
import View from './View';

const el = document.getElementById('react-root');

if (el) {
    console.log(el);
    const program: Program<CountModel, Msg> = {
        init: initialValue,
        update,
        view: View,
        renderTarget: el,
        dev: true
    };

    start(program);
}
