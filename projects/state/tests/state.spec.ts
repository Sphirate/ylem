jest.useFakeTimers();

import { YelmValidationError } from "@ylem/core";
import { State } from "../src";

describe.skip("State", () => {
    test("is defined", () => expect(State).toBeDefined());
    test("is class", () => expect(State.prototype).toBeDefined());
    test("throw validation error on construction", () => expect(() => new State(0, () => false)).toThrowError(YelmValidationError));
    test("throw validation error on update", () => {
        const state = new State<number>(0);
        expect(() => state.set(1)).toThrowError(YelmValidationError);
    });
    test("contain initial value", () => {
        const testObject = {};
        const state = new State(testObject);
        expect(state.get()).toStrictEqual(testObject);
    });

    test("value syncroniously changes", () => {
        const testObject = {};
        const state = new State<object>({});
        state.set(testObject);
        expect(state.get()).toStrictEqual(testObject);
    });

    test("listener won't be called right after change", () => {
        const listener = jest.fn();
        const state = new State(0);
        state.onChange.addListener(listener);
        state.set(1);
        expect(listener).not.toBeCalled();
    });

    test("listener will be called after change", () => {
        const listener = jest.fn();
        const state = new State(0);
        state.onChange.addListener(listener);
        state.set(1);

        jest.runAllTimers();

        expect(listener).toBeCalledTimes(1);
    });

    test("several sync changes will trigger listeners only once", () => {
        const listener = jest.fn();
        const state = new State(0);
        state.onChange.addListener(listener);
        state.set(1);
        state.set(2);
        state.set(3);
        state.set(4);

        jest.runAllTimers();

        expect(listener).toBeCalledTimes(1);
    });

    test("all state listeners will be triggered", () => {
        // expect.assertions(3);

        const listener1 = jest.fn();
        const listener2 = jest.fn();
        const listener3 = jest.fn();
        const state = new State(0);

        state.onChange.addListener(listener1);
        state.onChange.addListener(listener2);
        state.onChange.addListener(listener3);

        state.set(1);

        jest.runAllTimers();

        return Promise.resolve().then(() => {
            expect(listener1).toBeCalledTimes(1);
            expect(listener2).toBeCalledTimes(1);
            expect(listener3).toBeCalledTimes(1);
        });
    });
});
