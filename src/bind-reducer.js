const actionTypeMap = new Map();
const mutatorsMap = new Map();
const subscriptionsMap = new Map();

export const getReducersByActionType = type => actionTypeMap.get(type) || [];
export const getMutator = reducer => mutatorsMap.get(reducer);
export const getSubscriptions = reducer => subscriptionsMap.get(reducer) || [];

const bindReducerActions = (reducer, actions) => actions.forEach((type) => {
    const list = actionTypeMap.get(type) || [];
    actionTypeMap.set(type, [...list, reducer]);
});

export const bindReducer = (reducer, mutator, actions) => {
    bindReducerActions(reducer, actions);
    mutatorsMap.set(reducer, mutator);
};

export const addSubscription = (reducer, listener) => {
    if (typeof listener !== 'function') {
        throw new Error('Ylem.reducer::subscribe - Argument should be a function');
    }
    const list = subscriptionsMap.get(reducer) || [];
    subscriptionsMap.set(reducer, [...list, listener]);
};

export const removeSubscription = (reducer, listener) => {
    const list = subscriptionsMap.get(reducer) || [];
    subscriptionsMap.set(reducer, list.filter(fn => fn !== listener));
};
