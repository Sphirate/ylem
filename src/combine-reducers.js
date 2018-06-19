export const combineReducers = (reducersMap) => {
    const keys = Object.keys(reducersMap);
    const reducers = Object.values(reducersMap);

    const reducer = () => keys
        .reduce((acc, key) => Object.assign({}, acc, { [key]: reducersMap[key].getState() }), {});
    reducer.subscribe = listener => reducers.forEach(innerReducer => innerReducer.subscribe(listener));
    reducer.getSubscriptions = () => [];

    return reducer;
};
