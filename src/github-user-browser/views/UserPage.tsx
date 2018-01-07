import { ViewProps } from 'hathaway';
import * as React from 'react';
import { MyModel } from '../Model';
import Msg from '../Msg';
import SearchBox from './SearchBox';
import UserProfile from './UserProfile';
import Repos from './Repos';

const UserPage: React.SFC<ViewProps<MyModel, Msg, {}>> = ({ model, dispatch }: ViewProps<MyModel, Msg, {}>) => {
    return (
        <div className="root">
            <SearchBox model={model} dispatch={dispatch} componentProps={null} />
            <UserProfile model={model} dispatch={dispatch} componentProps={null} />
            <Repos model={model} dispatch={dispatch} componentProps={null} />
        </div>
    );
}

export default UserPage;
