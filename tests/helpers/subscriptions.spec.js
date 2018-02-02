import { buildSubscriptions } from './../../src/helpers';

describe('helpers::buildSubscriptions', () => {
    test('is defined', () => {
        expect(buildSubscriptions).toBeDefined();
    });

    test('return object with `getSubscriptions` and `subscribe` functions', () => {
        const result = buildSubscriptions();
        expect(result).toEqual(expect.objectContaining({
            getSubscriptions: expect.any(Function),
            subscribe: expect.any(Function),
        }));
    });

    test('`subscribe` function throw error if called without argument', () => {
        const { subscribe } = buildSubscriptions();
        expect(() => subscribe()).toThrow();
    });

    test('`subscribe` function throw error if argument is not a function', () => {
        const { subscribe } = buildSubscriptions();
        expect(() => subscribe('any argument')).toThrow();
    });

    test('`subscribe` function return `unsibscribe` function', () => {
        const { subscribe } = buildSubscriptions();
        expect(subscribe(() => {})).toBeInstanceOf(Function);
    });

    test('`getSubscriptions` function return empty array if there is no subscribed listener', () => {
        const { getSubscriptions } = buildSubscriptions();
        expect(getSubscriptions()).toEqual([]);
    });

    test('`getSubscriptions` function return new copy of listeners list', () => {
        const { getSubscriptions } = buildSubscriptions();
        expect(getSubscriptions() === getSubscriptions()).toBeFalsy(); // eslint-disable-line
    });

    describe('`getSubscriptions` function return list of subscribed listeners:', () => {
        const { getSubscriptions, subscribe } = buildSubscriptions();
        const unsubscribe = subscribe(() => {});
        subscribe(() => {});

        test('return array of 2 listeners after 2 subscriptions', () => {
            expect(getSubscriptions()).toHaveLength(2);
        });

        test('return array of 1 listener after 1 `unsubscribe` function call', () => {
            unsubscribe();
            expect(getSubscriptions()).toHaveLength(1);
        });
    });
});
