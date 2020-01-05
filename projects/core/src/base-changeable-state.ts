import { BaseState } from "./base-state";

export abstract class BaseChangeableState<T = any> extends BaseState<T> {
    public abstract set(data: T): void;
}
