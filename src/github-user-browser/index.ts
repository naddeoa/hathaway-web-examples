import { Program } from 'hathaway-core';
import { start } from 'hathaway';
import { initialValue, MyModel } from './Model';
import Msg from './Msg';
import update from './Update';
import View from './View';

const el = document.getElementById('react-root');

if (el) {
    const program: Program<MyModel, Msg> = {
        init: initialValue,
        update,
        view: View,
        renderTarget: el,
        dev: true
    };

    start(program);
}
