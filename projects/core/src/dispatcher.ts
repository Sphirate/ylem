import { EventSource, EventSourceListener } from "@ylem/event-source";

export interface Change<StateType = any> {
    current: StateType;
    previous: StateType;
    eventSource: EventSource;
    comparator: (a: StateType, b: StateType) => boolean;
}

const changesQueue = new Map<EventSource, Change<any>>();

const simultaneousDispatch = (eventSources: EventSource[]) => {
    const listeners: Set<EventSourceListener> = new Set();
    eventSources.map((eventSource) => ((eventSource as any).listeners as Set<EventSourceListener>).forEach((listener) => listeners.add(listener)));
    listeners.forEach((listener) => listener());
};

const performUpdate = () => {
    const eventSources: EventSource[] = [];
    changesQueue.forEach((change) => {
        const { current, previous, comparator, eventSource } = change;
        if (comparator(current, previous)) {
            return;
        }

        eventSources.push(eventSource);
    });

    changesQueue.clear();
    simultaneousDispatch(eventSources);
};

export const stateChanged = <T>(change: Change<T>) => {
    if (changesQueue.size === 0) {
        Promise.resolve().then(performUpdate);
    }

    const { eventSource, current } = change;
    changesQueue.set(eventSource, Object.assign(change, changesQueue.get(eventSource), { current }));
};
