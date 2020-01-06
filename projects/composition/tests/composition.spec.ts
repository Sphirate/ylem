import { BaseChangeableState, BaseState } from "@ylem/core";
import { State } from "@ylem/state";
import { CompositionState } from "./../src";

describe("CompositionState", () => {
    test("is defined", () => expect(CompositionState).toBeDefined());
    test("is class", () => expect(CompositionState.prototype).toBeDefined());
    test("implements BaseState abstract class", () => expect(new CompositionState([new State(0)], ([a]) => a)).toBeInstanceOf(BaseState));
    test("not implements BaseChangeableState abstract class", () => {
        expect(new CompositionState([new State(0)], ([a]) => a)).not.toBeInstanceOf(BaseChangeableState);
    });
    test("static create function create new instance", () => {
        expect(CompositionState.create([new State(0)], ([a]) => a)).toBeInstanceOf(CompositionState);
    });
    test("initial value equals compositor's fn return value", () => {
        const targetValue = {};
        const state = new CompositionState([new State(0)], () => targetValue);
        expect(state.get()).toStrictEqual(targetValue);
    });
    test("combiner will be called with array of states as first argument", () => {
        const combiner = jest.fn();
        const state1 = new State(1);
        const state2 = new State(2);
        const state3 = new State(3);
        const statesList = [ state1, state2, state3 ];

        // tslint:disable-next-line: no-unused-expression
        new CompositionState(statesList, combiner);
        state1.set(2);

        expect(combiner.mock.calls[0][0]).toEqual(statesList);
        expect(combiner.mock.calls[1][0]).toEqual(statesList);

    });
    test("trigger onSyncChange after composed state change", () => {
        const baseState = new State(0);
        const composedState = new CompositionState([baseState], ([state]) => state.get());
        const listener = jest.fn();
        composedState.onSyncChange.addListener(listener);
        baseState.set(1);
        expect(listener).toBeCalledTimes(1);
        expect(composedState.get()).toEqual(1);
    });
    test("trigger onChange after composed state change", async () => {
        const baseState = new State(0);
        const composedState = new CompositionState([baseState], ([state]) => state.get());
        const listener = jest.fn();
        composedState.onChange.addListener(listener);
        baseState.set(1);

        await null;

        expect(listener).toBeCalledTimes(1);
        expect(composedState.get()).toEqual(1);
    });
    test("won't trigger onSyncChange after composed state change if combiner return true", () => {
        const baseState = new State(0);
        const composedState = new CompositionState([baseState], ([state]) => state.get(), () => true);
        const listener = jest.fn();
        composedState.onSyncChange.addListener(listener);
        baseState.set(1);
        expect(listener).toBeCalledTimes(0);
        expect(composedState.get()).toEqual(0);
    });
    test("won't trigger onChange after composed state change if combiner return true between first and last value ", async () => {
        const baseState = new State(0);
        const composedState = new CompositionState([baseState], ([state]) => state.get());
        const listener = jest.fn();
        composedState.onChange.addListener(listener);
        baseState.set(1);
        baseState.set(0);

        await null;

        expect(listener).toBeCalledTimes(0);
        expect(composedState.get()).toEqual(0);
    });
});
