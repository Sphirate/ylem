export const combineReducers = (reducersMap) => {
    const entries = Object.entries(reducersMap);
    const reducers = Object.values(reducersMap);

    const reducer = () => entries.reduce((acc, [key, fn]) => ({ ...acc, [key]: fn() }), {});
    reducer.subscribe = (listener) => {
        const unsubscribers = reducers.map(innerReducer => innerReducer.subscribe(listener));
        return () => unsubscribers.forEach(fn => fn());
    };

    return Object.freeze(reducer);
};
