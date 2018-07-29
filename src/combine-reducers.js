export const combineReducers = (reducersMap) => {
    if (!(reducersMap instanceof Object)) {
        throw new Error('Reducers map should be of Object subclass type');
    }
    const entries = Object.entries(reducersMap);

    if (entries.length === 0) {
        throw new Error('Reducer map is empty. Check iterator property of your map');
    }
    entries.forEach(([key, reducer]) => {
        if (typeof reducer !== 'function' || typeof reducer.subscribe !== 'function') {
            throw new Error(`Given reducers map contain non-reducer value in ${key} key`);
        }
    });

    const constructor = reducersMap.constructor || reducersMap.__proto__.constructor; // eslint-disable-line
    const reducer = () => entries.reduce((acc, [key, fn]) => {
        acc[key] = fn();
        return acc;
    }, constructor());
    reducer.subscribe = (listener) => {
        const unsubscribers = entries.map(([, innerReducer]) => innerReducer.subscribe(listener));
        return () => unsubscribers.forEach(fn => fn());
    };

    return Object.freeze(reducer);
};
