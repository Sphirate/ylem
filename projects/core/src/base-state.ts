import { EventSource } from "@ylem/event-source";

export type Validator<StateType = any> = (value: StateType) => boolean;
export type Comparator<StateType = any> = (previousValue: StateType, currentValue: StateType) => boolean;

export abstract class BaseState<T = any> {
    public onChange = new EventSource();
    public onSyncChange = new EventSource();
    public abstract get(): T;
}
