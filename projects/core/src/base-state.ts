import { EventSource } from "@ylem/event-source";

export type Validator<StateType = any> = (value: StateType) => boolean;
export type Comparator<StateType = any> = (previousValue: StateType, currentValue: StateType) => boolean;

export abstract class BaseState<T = any> {
    public abstract get(): T;
    public onChange = new EventSource();
    public onSyncChange = new EventSource();
}

export abstract class BaseChangeableState<T = any> extends BaseState<T> {
    public abstract set(data: T): void;
}
