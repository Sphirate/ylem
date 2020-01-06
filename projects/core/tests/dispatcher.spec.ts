import { EventSource } from "@ylem/event-source";

import { stateChanged } from "../src/dispatcher";

describe("Dispatcher", () => {
    test("exists", () => expect(stateChanged).toBeDefined());
    test("is function", () => expect(typeof stateChanged).toEqual("function"));
    test("returns nothing (undefined)", () => {
        expect(stateChanged({ comparator: () => false, eventSource: new EventSource(), previous: null, current: 1 })).toBeUndefined();
    });
    test("dispatches event if state changed", async () => {
        const listener = jest.fn();
        const eventSource = new EventSource();

        eventSource.addListener(listener);

        stateChanged({ comparator: () => false, eventSource, previous: null, current: 1 });

        await null;

        expect(listener).toBeCalledTimes(1);
    });
    test("won't dispatch event if changes sequence returns state value to value at start", async () => {
        const listener = jest.fn();
        const eventSource = new EventSource();
        const comparator = (a: any, b: any) => a === b;

        eventSource.addListener(listener);

        stateChanged({ comparator, eventSource, previous: null, current: 1 });
        stateChanged({ comparator, eventSource, previous: 1, current: null });

        await null;

        expect(listener).toBeCalledTimes(0);
    });
    test("dispatch events for every given EventSource", async () => {
        const comparator = (a: any, b: any) => a === b;

        const listener1 = jest.fn();
        const eventSource1 = new EventSource();
        eventSource1.addListener(listener1);

        const listener2 = jest.fn();
        const eventSource2 = new EventSource();
        eventSource2.addListener(listener2);

        const listener3 = jest.fn();
        const eventSource3 = new EventSource();
        eventSource3.addListener(listener3);

        stateChanged({ comparator, eventSource: eventSource1, previous: null, current: 1 });
        stateChanged({ comparator, eventSource: eventSource2, previous: null, current: 2 });
        stateChanged({ comparator, eventSource: eventSource3, previous: null, current: 3 });

        await null;

        expect(listener1).toBeCalledTimes(1);
        expect(listener2).toBeCalledTimes(1);
        expect(listener3).toBeCalledTimes(1);
    });
    test("will trigger listener only once even if it was subscribed to several EventSources", async () => {
        const comparator = (a: any, b: any) => a === b;

        const listener = jest.fn();
        const eventSource1 = new EventSource();
        const eventSource2 = new EventSource();
        const eventSource3 = new EventSource();

        eventSource1.addListener(listener);
        eventSource2.addListener(listener);
        eventSource3.addListener(listener);

        stateChanged({ comparator, eventSource: eventSource1, previous: null, current: 1 });
        stateChanged({ comparator, eventSource: eventSource2, previous: null, current: 2 });
        stateChanged({ comparator, eventSource: eventSource3, previous: null, current: 3 });

        await null;

        expect(listener).toBeCalledTimes(1);
    });
});
