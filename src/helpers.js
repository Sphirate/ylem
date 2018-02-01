import { SymbolDispatch, SymbolGetActionTypes } from './symbols';

export const combineListeners = (state, listeners = []) => () => listeners.forEach(fn => fn(state));
export const isReducer = reducer => ['subscribe', 'getState', SymbolDispatch, SymbolGetActionTypes]
    .every(key => typeof reducer[key] === 'function');
export const isAction = action => (typeof action === 'object' && action !== null && action.type);
