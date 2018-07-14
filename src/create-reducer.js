import { bindReducer, addSubscription, removeSubscription } from './bind-reducer';

export const createReducer = (handler, actions) => {
    if (typeof handler !== 'function') {
        throw new Error('Ylem::createReducer - First argument should be a function');
    }
    if (!Array.isArray(actions)) {
        throw new Error('Ylem::createReducer - Second argument should be an array');
    }
    let state = handler(undefined, { type: undefined });

    const reducer = () => state;
    reducer.subscribe = (listener) => {
        addSubscription(reducer, listener);
        return () => removeSubscription(reducer, listener);
    };

    const mutator = (...actionsQueue) => {
        const newState = actionsQueue.reduce((acc, action) => handler(acc, action), state);
        if (newState !== state) {
            return () => {
                state = newState;
            };
        }
        return null;
    };

    bindReducer(reducer, mutator, actions);

    return Object.freeze(reducer);
};
