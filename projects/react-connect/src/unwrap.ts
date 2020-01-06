import { BaseState } from "@ylem/core";
import { unwrapState } from "./unwrap-state";

interface UnwrapProps<T> {
    children: BaseState<T> | T;
}

export const Unwrap = <T = any>({ children }: UnwrapProps<T>) => unwrapState(children);
