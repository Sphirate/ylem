import { BaseState } from "@ylem/core";
import * as React from "react";

export const bindState = <T = any>(state: BaseState<T>) => {
    const [ unwrapperdState, changeUnwrappedState ] = React.useState(state.get());
    React.useEffect(() => state.onChange.addListener(() => changeUnwrappedState(state.get())), [ state ]);
    return unwrapperdState;
};
