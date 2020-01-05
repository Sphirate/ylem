import { EventSource } from "../../event-source";

import { stateChanged } from "../src/dispatcher";

describe.skip("Dispatcher", () => {
    test("exists", () => expect(stateChanged).toBeDefined());
    test("is function", () => expect(typeof stateChanged).toEqual("function"));
    test("returns nothing (undefined)", () => {
        expect(stateChanged({ comparator: () => false, eventSource: new EventSource(), previous: null, current: 1 })).toBeUndefined();
    });
});
