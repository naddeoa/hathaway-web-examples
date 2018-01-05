import { ViewProps } from 'hathaway-core';
import * as React from 'react';
import { MyModel } from './Model';
import { parseRoute, Route } from './Routes';
import Msg from './Msg';
import UserPage from './views/UserPage';
import UnknownPage from './views/UnknownPage';



const View: React.SFC<ViewProps<MyModel, Msg, {}>> = ({ model, dispatch }: ViewProps<MyModel, Msg, {}>) => {
    const route: Route = parseRoute();

    switch (route.type) {
        case 'SearchRoute':
            return <UserPage model={model} dispatch={dispatch} componentProps={{}} />
        case 'UserRoute':
            return <UserPage model={model} dispatch={dispatch} componentProps={{}} />
        case 'UnknownRoute':
            return <UnknownPage model={model} dispatch={dispatch} componentProps={{}} />
    }
}

export default View;