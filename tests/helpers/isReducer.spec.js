import { SymbolDispatch, SymbolGetActionTypes } from './../../src/symbols';
import { isReducer } from './../../src/helpers';

describe('helpers::isReducer', () => {
    test('is defined', () => {
        expect(isReducer).toBeDefined();
    });

    test('is function', () => {
        expect(isReducer).toEqual(expect.any(Function));
    });

    test('return FALSE if argument is not an object', () => {
        [undefined, null, 1, '1', () => {}]
            .map(isReducer)
            .forEach(result => expect(result).toEqual(false));
    });

    test('return FALSE if argument doesn\'t match reducer API', () => {
        [
            { subscribe: () => {}, getState: () => {} },
            { [SymbolDispatch]: () => {}, [SymbolGetActionTypes]: () => {} },
        ]
            .map(isReducer)
            .forEach(result => expect(result).toEqual(false));
    });

    test('return TRUE if argument has reducer API', () => {
        const reducer = {
            getState: () => {},
            subscribe: () => {},
            [SymbolDispatch]: () => {},
            [SymbolGetActionTypes]: () => {},
        };
        expect(isReducer(reducer)).toEqual(true);
    });
});
