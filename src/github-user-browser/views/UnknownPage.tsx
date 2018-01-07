import { ViewProps } from 'hathaway';
import * as React from 'react';
import { MyModel } from '../Model';
import Msg from '../Msg';

const UnknownPage: React.SFC<ViewProps<MyModel, Msg, {}>> = (_props: ViewProps<MyModel, Msg, {}>) => {
    return (
        <div className="root">
            Unknown page
        </div>
    );
}

export default UnknownPage;
