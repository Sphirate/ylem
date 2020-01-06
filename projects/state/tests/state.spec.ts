import { BaseChangeableState, BaseState, YelmValidationError } from "@ylem/core";
import { State } from "../src";

describe("State", () => {
    test("is defined", () => expect(State).toBeDefined());
    test("is class", () => expect(State.prototype).toBeDefined());
    test("implements BaseState abstract class", () => expect(new State(1)).toBeInstanceOf(BaseState));
    test("implements BaseChangeableState abstract class", () => expect(new State(1)).toBeInstanceOf(BaseChangeableState));
    test("static create function create new instance", () => expect(State.create(0)).toBeInstanceOf(State));
    test("throw validation error on construction", () => expect(() => new State(0, () => false)).toThrowError(YelmValidationError));
    test("throw validation error on update", () => {
        const state = new State<number>(0, (value) => value === 0);
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
});
