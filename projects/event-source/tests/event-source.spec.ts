import { EventSource } from "../src/index";

describe("EventSource", () => {
    test("exist", () => expect(EventSource).toBeDefined());
    test("is class", () => expect(new EventSource()).toBeInstanceOf(EventSource));
    test("dispatch data to subscribed listener", () => {
        const listener = jest.fn();
        const eventSource = new EventSource();
        eventSource.addListener(listener);

        eventSource.dispatch();

        expect(listener).toBeCalledTimes(1);
    });
    test("dispatch data to all subscribed listeners", () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();
        const listener3 = jest.fn();
        const eventSource = new EventSource();

        eventSource.addListener(listener1);
        eventSource.addListener(listener2);
        eventSource.addListener(listener3);

        eventSource.dispatch();
        
        expect(listener1).toBeCalledTimes(1);
        expect(listener2).toBeCalledTimes(1);
        expect(listener3).toBeCalledTimes(1);
    });
    test("envoke listener on every dispatch", () => {
        const listener = jest.fn();
        const eventSource = new EventSource();
        eventSource.addListener(listener);

        eventSource.dispatch();
        eventSource.dispatch();
        eventSource.dispatch();

        expect(listener).toBeCalledTimes(3);
    });
    test("remove listener", () => {
        const listener = jest.fn();
        const eventSource = new EventSource();

        eventSource.addListener(listener);
        eventSource.dispatch();

        eventSource.removeListener(listener);
        eventSource.dispatch();
        expect(listener).toBeCalledTimes(1);
    });
    test("check is listener subscribed", () => {
        const listener = jest.fn();
        const eventSource = new EventSource();

        eventSource.addListener(listener);
        expect(eventSource.hasListener(listener)).toStrictEqual(true);

        eventSource.removeListener(listener);
        expect(eventSource.hasListener(listener)).toStrictEqual(false);
    });
});
