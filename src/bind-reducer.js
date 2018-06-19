const actionTypeMap = new Map();
const storeReducers = new Map();

export const getReducersByActionType = type => actionTypeMap.get(type) || [];
export const getMutator = reducer => storeReducers.get(reducer);

const bindReducerActions = (reducer, actions) => actions.forEach((type) => {
    const list = actionTypeMap.get(type) || [];
    actionTypeMap.set(type, [...list, reducer]);
});

export const bindReducer = (reducer, mutator, actions) => {
    bindReducerActions(reducer, actions);
    storeReducers.set(reducer, mutator);
};
