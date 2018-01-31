import { SymbolDispatch, SymbolGetActionTypes } from './symbols';
import { combineListeners } from './helpers';

export const createReducer = (initialState, getConfig) => {
    const handlers = new Map();
    let state = initialState;
    let listeners = [];

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
        return [combineListeners(state, listeners)];
    };

    const dispatch = (...actions) => {
        const newState = actions
            .reduce((acc, { type, payload }) => {
                const handler = this[SymbolHandlers].get(type);
                if (handler) {
                    return handler(acc, payload);
                }
                return acc;
            }, state);
        return emit(newState);
    };

    const subscribe = (listener) => {
        if (typeof listener !== 'function') {
            throw new Error('Listener should be a function');
        }
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(fn => fn !== listeners);
        };
    };

    return {
        subscribe,
        getState: () => state,
        [SymbolDispatch]: dispatch,
        [SymbolGetActionTypes]: () => Array.from(handlers.keys()),
    };
};
