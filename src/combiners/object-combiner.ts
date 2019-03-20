import { getStatePropertyDescriptor, subscribeFactory } from './../helpers';
import { YlemAlreadyOccupiedKeyError, YlemKeyIsUndefinedError } from './errors';

type CombinedStateMap<T = any> = {
    [K in keyof T]: T[K];
}

type StatesMap<T extends CombinedStateMap> = {
    [K in keyof T]: Ylem.State<T[K]>;
}

export const objectCombiner = <T extends CombinedStateMap>(statesMap: StatesMap<T>) => {
    const listener = () => {};

    const states = new Map<keyof typeof statesMap, [Ylem.State, Ylem.Subscription.Unsubscriber]>();
    Object.keys(statesMap).forEach(key => states.set(key, [statesMap[key], statesMap[key].onSyncChange(listener)]));

    const syncListeners = new Set();
    const asyncListeners = new Set();
    
    const getter = () => {
        const result: any = { __proto__: null };
        for (const [key, [ value ]] of states.entries()) {
            result[key] = value();
        }
        return result;
    };

    Object.defineProperties(getter, {
        get: getStatePropertyDescriptor(getter.bind(null)),
        add: getStatePropertyDescriptor((stateObject, key) => {
            if (states.has(key)) {
                throw new YlemAlreadyOccupiedKeyError(`Property "${key}" already occupied`);
            }
            states.set(key, [stateObject, stateObject.onSyncChange(listener)]);
        }),
        remove: getStatePropertyDescriptor((key) => {
            if (!states.has(key)) {
                throw new YlemKeyIsUndefinedError(`Could not find state by key "${key}"`);
            }
            states.get(key)[1]();
            states.delete(key);
        }),
        onChange: getStatePropertyDescriptor(subscribeFactory(asyncListeners)),
        onSyncChange: getStatePropertyDescriptor(subscribeFactory(syncListeners)),
    });

    return getter;
};
