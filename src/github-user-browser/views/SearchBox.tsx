import { Dispatch } from 'hathaway';
import * as React from 'react';
import { KeyboardEvent } from 'react';

import Msg from '../Msg';

const onEnter = (dispatch: Dispatch<Msg>) => (event: KeyboardEvent<HTMLElement>) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        dispatch({ type: 'OnUsernameSearch', pushInHistory: true })
    }
}

const onChange = (dispatch: Dispatch<Msg>) => (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'OnUsernameSearchChanged', text: event.target.value });
}


export type Props = {
    username: string,
    dispatch: Dispatch<Msg>

}
const View: React.SFC<Props> = ({ username, dispatch }) => {
    return (
        <div className="search-container">
            <input className="user-search" placeholder="Search for a github user" onKeyUp={onEnter(dispatch)} onChange={onChange(dispatch)} value={username} />
        </div>
    );
}


export default View;