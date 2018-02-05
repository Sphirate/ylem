import { createReducer } from './../src/reducer';
import { isReducer } from '../src/helpers';
import { SymbolGetActionTypes, SymbolDispatch } from '../src/symbols';

describe('createReducer', () => {
    test('is defined', () => {
        expect(createReducer).toBeDefined();
    });

    test('is function', () => {
        expect(createReducer).toEqual(expect.any(Function));
    });

    test('return reducer object', () => {
        const reducer = createReducer(null, () => {});
        expect(isReducer(reducer)).toEqual(true);
    });

    test('throw error if second argument is not a function', () => {
        expect(() => createReducer(null, null)).toThrow();
    });

    test('second argument is called', () => {
        const fn = jest.fn();
        createReducer(null, fn);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    test('second argument accept argument with chaining method "on"', () => {
        const fn1 = jest.fn();
        createReducer(null, fn1);
        expect(fn1).toHaveBeenCalledWith(expect.objectContaining({
            on: expect.any(Function),
        }));

        createReducer(
            null,
            ({ on }) => expect(on('a', () => {})).toEqual(expect.objectContaining({
                on: expect.any(Function),
            })),
        );
    });

    test('"on" method throw error if second argument is not a function', () => {
        expect(() => createReducer(null, ({ on }) => on(null, null))).toThrow();
    });

    describe('returned reducer', () => {
        test('getState method return initial state value if non actions were performed', () => {
            const initialState = ['a', 1, null, undefined, () => {}];
            const reducer = createReducer(initialState, () => {});
            expect(reducer.getState()).toBe(initialState);
        });

        test('special method [Symbol(GetActionTypes)] return list of all registered action types', () => {
            const actionTypes = ['a', 1, null, undefined, Symbol('custom action type'), () => {}];
            const reducer = createReducer(
                null,
                config => actionTypes.reduce(({ on }, type) => on(type, () => {}), config),
            );
            expect(reducer[SymbolGetActionTypes]()).toEqual(actionTypes);
        });

        describe('dispatch method', () => {
            test('return empty array if there are no actions', () => {
                const reducer = createReducer(null, () => {});
                const result = reducer[SymbolDispatch]();
                expect(result).toEqual(expect.any(Array));
                expect(result).toHaveLength(0);
            });

            test('return empty array if action handler didn\'t change state by reference', () => {
                const reducer = createReducer(null, ({ on }) => on('a', state => state));
                const result = reducer[SymbolDispatch]({ type: 'a' });
                expect(result).toEqual(expect.any(Array));
                expect(result).toHaveLength(0);
            });

            test('return empty array if action handler is not registered', () => {
                const reducer = createReducer(null, ({ on }) => on('a', state => state));
                const result = reducer[SymbolDispatch]({ type: 'b' });
                expect(result).toEqual(expect.any(Array));
                expect(result).toHaveLength(0);
            });

            test('return array with 1 function if several actions were called', () => {
                const reducer = createReducer(
                    { c: 3 },
                    ({ on }) => on('a', state => Object.assign({}, state, { a: 1 }))
                        .on('b', state => Object.assign({}, state, { b: 2 })),
                );
                const result = reducer[SymbolDispatch]({ type: 'a' }, { type: 'b' });
                expect(result).toEqual(expect.any(Array));
                expect(result).toHaveLength(1);
                expect(reducer.getState()).toEqual({ a: 1, b: 2, c: 3 });
            });

            test('action handler called with current state and payload arguments', () => {
                const initialState = { c: 3 };
                const payload = { id: 1 };
                const reducer = createReducer(
                    initialState,
                    ({ on }) => on('a', (s, p) => {
                        expect(s).toBe(initialState);
                        expect(p).toBe(payload);
                    }),
                );
                reducer[SymbolDispatch]({ type: 'a', payload });
            });
        });
    });
});
