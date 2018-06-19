import { bindReducer } from './bind-reducer';

export const createReducer = (handler, actions) => {
    let state = handler(undefined, { type: undefined });
    let subscriptions = [];

    const reducer = () => state;

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

    reducer.getSubscriptions = () => subscriptions;
    reducer.subscribe = (subscriptionHandler) => {
        subscriptions.push(subscriptionHandler);
        return () => {
            subscriptions = subscriptions.filter(func => func !== subscriptionHandler);
        };
    };

    return reducer;
};
