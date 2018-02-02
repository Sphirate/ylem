import { combineListeners } from './../../src/helpers';

describe('helpers::combineListeners', () => {
    test('is defined', () => {
        expect(combineListeners).toBeDefined();
    });

    test('is function', () => {
        expect(combineListeners).toEqual(expect.any(Function));
    });

    test('return function', () => {
        expect(combineListeners(null, [])).toEqual(expect.any(Function));
    });

    test('return function call every listener with supplied state once', () => {
        const listeners = (new Array(5)).map(() => jest.fn());
        const state = 'hello';
        combineListeners(state, listeners)();

        listeners.forEach((fn) => {
            expect(fn).toHaveBeenCalledTimes(1);
            expect(fn).toHaveBeenCalledWith(state);
        });
    });
});
