import * as React from "react";
import { BaseState } from "@ylem/core";

export const bindState = <T = any>(state: BaseState<T>) => {
    const [ unwrapperdState, changeUnwrappedState ] = React.useState(state.get());
    React.useEffect(() => state.onChange.addListener(() => changeUnwrappedState(state.get())), [ state ]);
    return unwrapperdState;
};
