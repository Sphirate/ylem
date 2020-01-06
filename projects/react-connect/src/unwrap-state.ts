import { BaseState } from "@ylem/core";

export const unwrapState = <T = any>(value: BaseState<T> | T) => {
    if (value instanceof BaseState) {
        return value.get();
    }
    return value;
};
