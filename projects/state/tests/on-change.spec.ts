import { State } from "./../src";

describe("State onChange eventSource", () => {
    test("listener won't be called right after change", () => {
        const listener = jest.fn();
        const state = new State(0);
        state.onChange.addListener(listener);
        state.set(1);
        expect(listener).not.toBeCalled();
    });
    test("listener will be called after change", async () => {
        const listener = jest.fn();
        const state = new State(0);
        state.onChange.addListener(listener);
        state.set(1);

        await null;
        expect(listener).toBeCalledTimes(1);
    });
    test("several sync changes will trigger listeners only once", async () => {
        const listener = jest.fn();
        const state = new State(0);
        state.onChange.addListener(listener);
        state.set(1);
        state.set(2);
        state.set(3);
        state.set(4);

        await null;

        expect(listener).toBeCalledTimes(1);
    });
    test("all state listeners will be triggered", async () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();
        const listener3 = jest.fn();
        const state = new State(0);

        state.onChange.addListener(listener1);
        state.onChange.addListener(listener2);
        state.onChange.addListener(listener3);

        state.set(1);

        await null;

        expect(listener1).toBeCalledTimes(1);
        expect(listener2).toBeCalledTimes(1);
        expect(listener3).toBeCalledTimes(1);
    });
    test("listener will be triggered once even if it is subscribed to several changed states", async () => {
        const listener = jest.fn();

        const state1 = new State(0);
        const state2 = new State(0);

        state1.onChange.addListener(listener);
        state2.onChange.addListener(listener);

        state1.set(1);
        state2.set(2);

        await null;
        expect(listener).toBeCalledTimes(1);
    });
});
