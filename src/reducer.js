import { SymbolDispatch, SymbolGetActionTypes } from './symbols';
import { combineListeners, buildSubscriptions } from './helpers';

export const createReducer = (initialState, getConfig) => {
    const handlers = new Map();
    let state = initialState;

    const { getSubscriptions, subscribe } = buildSubscriptions();

    const on = (actionType, handler) => {
        if (typeof handler !== 'function') {
            throw new Error('Action handler should be a function');
        }
        handlers.set(actionType, handler);
        return { on };
    };
    getConfig({ on });

    const emit = (newState) => {
        if (state === newState) {
            return [];
        }
        state = newState;
        return [combineListeners(state, getSubscriptions())];
    };

    const dispatch = (...actions) => {
        const newState = actions
            .reduce((acc, { type, payload }) => {
                const handler = handlers.get(type);
                if (handler) {
                    return handler(acc, payload);
                }
                return acc;
            }, state);
        return emit(newState);
    };

    return {
        subscribe,
        getState: () => state,
        [SymbolDispatch]: dispatch,
        [SymbolGetActionTypes]: () => Array.from(handlers.keys()),
    };
};
