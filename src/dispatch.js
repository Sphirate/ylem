import { getReducersByActionType, getMutator } from './bind-reducer';

const call = fn => fn();

export const dispatch = (...actions) => {
    const subscriptions = new Set();
    try {
        const applyStates = [];
        actions
            .reduce((acc, action) => {
                getReducersByActionType(action.type)
                    .forEach(reducer => acc.add(reducer));
                return acc;
            }, new Set())
            .forEach((reducer) => {
                const applyStateFn = getMutator(reducer)(...actions);
                if (applyStateFn) {
                    applyStates.push(applyStateFn);
                    reducer.getSubscriptions().forEach(sub => subscriptions.add(sub));
                }
            });
        applyStates.forEach(call);
        subscriptions.forEach(call);
    } catch (e) {
        throw e;
    }
};
