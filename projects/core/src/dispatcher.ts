import { EventSource } from "@ylem/event-source";

export interface Change<StateType = any> {
    current: StateType;
    previous: StateType;
    eventSource: EventSource;
    comparator: (a: StateType, b: StateType) => boolean;
}

const changesQueue = new Map<EventSource, Change<any>>();

const performUpdate = () => {
    if (changesQueue.size === 0) {
        return;
    }
    changesQueue.forEach((change) => {
        const { current, previous, comparator, eventSource } = change;
        if (comparator(current, previous)) {
            return;
        }

        eventSource.dispatch();
    });

    changesQueue.clear();
};

export const stateChanged = <T>(change: Change<T>) => {
    if (changesQueue.size === 0) {
        Promise.resolve().then(performUpdate);
    }

    const { eventSource, current } = change;
    changesQueue.set(eventSource, Object.assign(change, changesQueue.get(eventSource), { current }));
};
