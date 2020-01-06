import { BaseState, Comparator, stateChanged } from "@ylem/core";

export class CompositionState<T = any, States extends BaseState[] = BaseState[]> extends BaseState<T> {
    public static create =
        <T = any, States extends BaseState[] = BaseState[]>(states: States, combiner: (statesList: States) => T, comparator?: Comparator) =>
            new CompositionState(states, combiner, comparator);

    public static defaultComparator: Comparator = (oldValue, newValue) => oldValue === newValue;

    protected value: T;

    constructor(
        protected states: States,
        protected combiner: (statesList: States) => T,
        protected comparator: Comparator<T> = CompositionState.defaultComparator,
    ) {
        super();
        this.handleSyncChange = this.handleSyncChange.bind(this);
        this.value = this.getActualValue();

        states.forEach((state) => state.onSyncChange.addListener(this.handleSyncChange));
    }

    public get() {
        return this.value;
    }

    protected getActualValue() {
        return this.combiner(this.states);
    }

    protected handleSyncChange() {
        const value = this.getActualValue();
        if (this.comparator(this.value, value)) {
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
