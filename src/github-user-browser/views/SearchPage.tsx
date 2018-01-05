import { ViewProps } from 'hathaway-core';
import * as React from 'react';
import { MyModel } from '../Model';
import Msg from '../Msg';
import SearchBox from './SearchBox';

const SearchPage: React.SFC<ViewProps<MyModel, Msg, {}>> = ({ model, dispatch }: ViewProps<MyModel, Msg, {}>) => {
    return (
        <div className="root">
            <SearchBox model={model} dispatch={dispatch} componentProps={null} />
            <div>Try to search for a github username</div>
        </div>
    );
}

export default SearchPage;