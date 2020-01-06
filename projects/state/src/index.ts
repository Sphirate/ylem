import { BaseChangeableState, Comparator, stateChanged, Validator, YelmValidationError } from "@ylem/core";

export class State<StateType = any> extends BaseChangeableState<StateType> {
    public static defaultValidator = () => true;
    public static defaultComparator = <T = any>(previousValue: T, currentValue: T) => previousValue === currentValue;
    public static create = <T>(value: T, validator?: Validator<T>, comparator?: Comparator<T>) => new State(value, validator, comparator);

    constructor(
        private value: StateType,
        private validator: Validator<StateType> = State.defaultValidator,
        private comparator: Comparator<StateType> = State.defaultComparator,
    ) {
        super();
        if (!validator(this.value)) {
            throw new YelmValidationError();
        }
    }

    public get() {
        return this.value;
    }

    public set(value: StateType) {
        if (!this.validator(value)) {
            throw new YelmValidationError();
        }
        if (this.comparator(value, this.value)) {
            return;
        }
        const previous = this.value;
        this.value = value;
        stateChanged({
            comparator: this.comparator,
            current: this.value,
            eventSource: this.onChange,
            previous,
        });
        this.onSyncChange.dispatch();
    }
}
