/**
 * Generate property desciptor for StateObject methods
 * @param {Function} fn Body of method
 * @returns {PropertyDescriptor}
 */
export const getStatePropertyDescriptor = fn => ({
    configurable: false,
    enumerable: false,
    writable: false,
    value: fn,
});

/**
 * Generate subscribe function. Use given Set object as listeners storage
 * @param {Set} setObject Set object that will contain listeners
 * @returns {() => () => void}
 */
export const subscribeFactory = setObject => (listener) => {
    setObject.add(listener);
    return () => setObject.delete(listener);
};
