import { State } from "./../src";

describe("State onSyncChange eventSource", () => {
    test("should trigger listener right after change", () => {
        const listener = jest.fn();
        const state = new State(0);
        state.onSyncChange.addListener(listener);
        state.set(1);

        expect(listener).toBeCalledTimes(1);
    });
    test("should trigger listener right after every change", () => {
        const listener = jest.fn();
        const state = new State(0);
        state.onSyncChange.addListener(listener);
        state.set(1);
        state.set(2);
        state.set(3);

        expect(listener).toBeCalledTimes(3);
    });
    test("listener can change another state", () => {
        const targetValue = {};
        const listener = jest.fn();
        const state1 = new State<any>(0);
        const state2 = new State<any>(0);
        state2.onSyncChange.addListener(listener);
        state1.onSyncChange.addListener(() => {
            state2.set(state1.get());
        });
        state1.set(targetValue);

        expect(listener).toBeCalledTimes(1);
        expect(state2.get()).toStrictEqual(targetValue);
    });
    test("won't change if comparator returns true", () => {
        const listener = jest.fn();
        const state = new State(0, () => true, () => true);
        state.onSyncChange.addListener(listener);
        state.set(1);
        expect(listener).not.toBeCalled();
    });
});
