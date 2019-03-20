import { IllegalStateValueError } from './errors';
import { getStatePropertyDescriptor, subscribeFactory } from './helpers';

/**
 * Factory function for state generation
 * @param {any} initialValue Initial value for state. Also will be used for `reset` action
 * @param {(value) => boolean} validator Validation function to check if given value is correct.
 * Any value allowed by default
 */
export const stateFactory = (initialValue, validator = () => true) => {
    if (!validator(initialValue)) {
        throw new IllegalStateValueError('Illegal initial value');
    }
    let state = initialValue;
    const syncListeners = new Set();
    const asyncListeners = new Set();
    const handleChange = (newValue) => {
        state = newValue;
        syncListeners.forEach(listener => listener());
        setTimeout(() => asyncListeners.forEach(listener => listener()), 0);
    };

    const getter = () => state;

    Object.defineProperties(getter, {
        get: getStatePropertyDescriptor(getter.bind(null)),
        set: getStatePropertyDescriptor((value) => {
            if (value === state) {
                return;
            }
            if (!validator(value)) {
                throw new IllegalStateValueError('Illegal state value');
            }
            handleChange(value, state);
        }),
        reset: getStatePropertyDescriptor(() => getter.set(initialValue)),
        onChange: getStatePropertyDescriptor(subscribeFactory(asyncListeners)),
        onSyncChange: getStatePropertyDescriptor(subscribeFactory(syncListeners)),
        __dangerousSilentSet: getStatePropertyDescriptor((value) => {
            if (value === state) {
                return [[], []];
            }
            if (!validator(value)) {
                throw new IllegalStateValueError('Illegal state value');
            }
            state = value;
            return [[...syncListeners], [...asyncListeners]];
        }),
    });
    return getter;
};
