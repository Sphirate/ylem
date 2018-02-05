import { createStore } from './../src/root';
import { createReducer } from '../src/reducer';
import { SymbolGetActionTypes, SymbolDispatch } from '../src/symbols';

describe('createStore', () => {
    test('is defined', () => {
        expect(createStore).toBeDefined();
    });

    test('is function', () => {
        expect(createStore).toEqual(expect.any(Function));
    });

    test('throw error if argument is not a reducer', () => {
        const reducer = createReducer(null, () => {});

        expect(() => createStore(reducer)).not.toThrow();
        expect(() => createStore({})).toThrow();
    });

    describe('', () => {
        let reducer;
        let handler1;
        let handler2;
        let store;

        beforeEach(() => {
            handler1 = jest.fn();
            handler2 = jest.fn();
            reducer = {
                subscribe: jest.fn(),
                getState: jest.fn(() => {}),
                [SymbolGetActionTypes]: () => ['a', 'b'],
                [SymbolDispatch]: jest.fn(() => [handler1, handler2]),
            };
            store = createStore(reducer);
        });

        test('return object with "dispatch", "subscribe" and "getState" methods', () => {
            expect(store).toEqual(expect.objectContaining({
                dispatch: expect.any(Function),
                subscribe: expect.any(Function),
                getState: expect.any(Function),
            }));
        });

        test('wont call reducers dispatch method if there is no action', () => {
            store.dispatch();
            expect(reducer[SymbolDispatch]).not.toHaveBeenCalled();
        });

        test('throw error if one of given arguments is not an action', () => {
            const actions = [{ type: 'a' }, { type: 'b', c: 1 }, { type: 'c', payload: 1 }];
            expect(() => store.dispatch(...actions)).not.toThrow();
            expect(() => store.dispatch(...actions, null)).toThrow();
        });

        test('throw error if try to dispatch action while dispatching another one', () => {
            handler1.mockImplementationOnce(() => store.dispatch({ type: 'b' }));
            expect(() => store.dispatch({ type: 'a' })).toThrow();
        });

        test('executes every callback in returned listeners chain', () => {
            store.dispatch({ type: 'a' });
            [handler1, handler1]
                .forEach(fn => expect(fn).toHaveBeenCalled());
        });

        test('restore dispatching state if reducer throw error', () => {
            handler1.mockImplementationOnce(() => {
                throw new Error('a');
            });

            expect(() => store.dispatch({ type: 'a' })).toThrow();
            expect(() => store.dispatch({ type: 'a' })).not.toThrow();
        });
    });
});
