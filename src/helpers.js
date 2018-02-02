import { SymbolDispatch, SymbolGetActionTypes } from './symbols';

export const combineListeners = (state, listeners = []) => () => listeners.forEach(fn => fn(state));
export const isReducer = reducer => ['subscribe', 'getState', SymbolDispatch, SymbolGetActionTypes]
    .every(key => typeof reducer[key] === 'function');
export const isAction = action => !!(typeof action === 'object' && action !== null && action.type);
export const buildSubscriptions = () => {
    let subscriptions = [];

    const getSubscriptions = () => [...subscriptions];
    const subscribe = (listener) => {
        if (typeof listener !== 'function') {
            throw new Error('Listener should be a function');
        }

        subscriptions.push(listener);
        return () => {
            subscriptions = subscriptions.filter(fn => fn !== listener);
        };
    };

    return { getSubscriptions, subscribe };
};
