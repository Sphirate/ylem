import { getStatePropertyDescriptor, subscribeFactory } from './../helpers';

export const customCombiner: Ylem.Combiners.CustomCombiner = <T>(states: Ylem.Combiners.CustomCombiner.Arguments.StatesList, transformFn: Ylem.Combiners.CustomCombiner.Arguments.Transformer<T>) => {
    const syncListeners = new Set();
    const asyncLiteners = new Set();

    const subscribeHandler = () => setter();
    const statesList = new Map();
    states.forEach((state) => statesList.set(state, state.onSyncChange(subscribeHandler)));
    let state: T = transformFn([...statesList.keys()], undefined);

    const setter = () => {
        const oldState = state;
        state = transformFn([...statesList.keys()], oldState);
        if (state !== oldState) {
            syncListeners.forEach((listener) => listener(state));
            setTimeout(() => asyncLiteners.forEach((listener) => listener(state)), 0);
        }
    };

    const getter = () => state;

    Object.defineProperties(getter, {
        get: getStatePropertyDescriptor(() => state),
        onChange: getStatePropertyDescriptor(subscribeFactory(asyncLiteners)),
        onSyncChange: getStatePropertyDescriptor(subscribeFactory(syncListeners)),
        add: getStatePropertyDescriptor((state: Ylem.State.Base) => {
            if (!statesList.has(state)) {
                statesList.set(state, state.onSyncChange(subscribeHandler));
                setter();
            }
        }),
        remove: getStatePropertyDescriptor((state) => {
            if (statesList.has(state)) {
                statesList.get(state)(); // Unsub
                statesList.delete(state);
                setter();
            }
        }),
        destroy: getStatePropertyDescriptor(() => {
            statesList.forEach((unsubscribe) => unsubscribe());
            statesList.clear();
        }),
    });

    return getter as Ylem.Combiners.CustomCombiner.State<T>;
};
