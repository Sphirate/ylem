import { BaseState, Comparator, stateChanged } from "@ylem/core";

export class CompositionState<T = any, States extends Array<BaseState> = Array<BaseState>> extends BaseState<T> {
    static create = <T = any, States extends Array<BaseState> = Array<BaseState>>(states: States, combiner: (statesList: States) => T, comparator: Comparator) => new CompositionState(states, combiner, comparator);

    static defaultComparator: Comparator = (oldValue, newValue) => oldValue === newValue;

    protected value: T;

    constructor(protected states: States, protected combiner: (statesList: States) => T, protected comparator: Comparator<T> = CompositionState.defaultComparator) {
        super();
        this.handleSyncChange = this.handleSyncChange.bind(this);
        this.value = this.getActualValue();
        
        states.forEach((state) => state.onSyncChange.addListener(this.handleSyncChange));
    }

    protected handleSyncChange() {
        const value = this.getActualValue();
        if (!this.comparator(this.value, value)) {
            return;
        }
        const previous = this.value;
        this.value = value;
        stateChanged({
            previous,
            current: this.value,
            eventSource: this.onChange,
            comparator: this.comparator,
        });
        this.onSyncChange.dispatch();
    }

    protected getActualValue() {
        return this.combiner(this.states);
    }

    public get() {
        return this.value;
    }
}