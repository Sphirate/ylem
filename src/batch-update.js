/**
 * @param {Array<[object, any]>} changes
 */
export const batchUpdate = (changes) => {
    const uniqueChangesMap = new Map();
    changes.forEach(([state, value]) => uniqueChangesMap.set(state, [value, state()]));

    const syncListenersSet = new Set();
    const asyncListenersSet = new Set();

    uniqueChangesMap.forEach((value, state) => {
        // eslint-disable-next-line no-underscore-dangle
        const [syncListeners, asyncListeners] = state.__dangerousSilentSet(value);
        syncListeners.forEach(listener => syncListenersSet.add(listener));
        asyncListeners.forEach(listener => asyncListenersSet.add(listener));
    });

    syncListenersSet.forEach(listener => listener());
    setTimeout(() => asyncListenersSet.forEach(listener => listener()), 0);
};
