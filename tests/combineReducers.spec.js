import { combineReducers } from '../src/combinedReducer';
import { createReducer } from '../src/reducer';
import { SymbolDispatch, SymbolGetActionTypes } from '../src/symbols';
import { isReducer } from '../src/helpers';

describe('combineReducers', () => {
    test('is defined', () => {
        expect(combineReducers).toBeDefined();
    });

    test('is function', () => {
        expect(combineReducers).toEqual(expect.any(Function));
    });

    test('return object is reducer', () => {
        const mockReducer = () => createReducer(null, () => {});
        const map = ['a', 'b', 'c']
            .reduce((acc, next) => Object.assign({}, acc, { [next]: mockReducer() }), {});
        expect(isReducer(combineReducers(map))).toBeTruthy();
    });

    test('throw error if given reducers map values are not reducers', () => {
        const mockReducer = () => createReducer(null, () => {});
        const validMap = ['a', 'b', 'c']
            .reduce((acc, next) => Object.assign({}, acc, { [next]: mockReducer() }), {});
        const invalidMap = Object.assign({}, validMap, { d: {} });

        expect(() => combineReducers(validMap)).not.toThrow();
        expect(() => combineReducers(invalidMap)).toThrow();
    });

    describe('', () => {
        let reducersMap;
        let reducer;

        beforeEach(() => {
            reducersMap = {
                a: createReducer(
                    {},
                    config => config
                        .on('all', () => {})
                        .on('one', () => {})
                        .on('equal', state => state),
                ),
                b: createReducer(
                    {},
                    config => config
                        .on('all', () => {})
                        .on('two', () => {})
                        .on('equal', state => state),
                ),
                c: createReducer(
                    {},
                    config => config
                        .on('all', () => {})
                        .on('two', () => {})
                        .on('equal', state => state),
                ),
            };

            reducer = combineReducers(reducersMap);
        });

        test('state contain all child reducers states by reference', () => {
            const testReducer = () => {
                const state = Object.keys(reducersMap)
                    .reduce((acc, next) => Object.assign({}, acc, { [next]: reducersMap[next].getState() }), {});

                expect(reducer.getState())
                    .toEqual(state);
            };

            testReducer();
            reducer[SymbolDispatch]({ type: 'all' });
            testReducer();
        });

        test('return empty listeners chain if child reducers not changed', () => {
            const chain = reducer[SymbolDispatch]({ type: 'equal' });
            expect(chain).toEqual(expect.any(Array));
            expect(chain).toHaveLength(0);
        });

        test('return listeners chain with all child callbacks', () => {
            const chain = reducer[SymbolDispatch]({ type: 'two' });
            expect(chain).toEqual(expect.any(Array));
            expect(chain).toHaveLength(2);
        });

        test('add own callback to listener chain if is subscribed', () => {
            let chain;
            const unsub = reducer.subscribe(() => {});
            chain = reducer[SymbolDispatch]({ type: 'two' });
            expect(chain).toEqual(expect.any(Array));
            expect(chain).toHaveLength(3);

            unsub();
            chain = reducer[SymbolDispatch]({ type: 'one' });
            expect(chain).toEqual(expect.any(Array));
            expect(chain).toHaveLength(1);
        });

        test('recieve chain with only 1 callback for every changed reducer if several actions performed', () => {
            const chain = reducer[SymbolDispatch]({ type: 'all' }, { type: 'one' });
            expect(chain).toEqual(expect.any(Array));
            expect(chain).toHaveLength(3);
        });

        test('getActionTypes return list of all child reducers action types', () => {
            const types = reducer[SymbolGetActionTypes]();
            expect(types).toEqual(['all', 'one', 'equal', 'two']);
        });
    });
});
