import { isAction } from './../../src/helpers';

describe('helpers::isAction', () => {
    test('is defined', () => {
        expect(isAction).toBeDefined();
    });

    test('is function', () => {
        expect(isAction).toEqual(expect.any(Function));
    });

    test('return FALSE if argument isn\'t object', () => {
        [undefined, null, true, 1, '1', () => {}, [], Symbol('any')]
            .map(isAction)
            .forEach(result => expect(result).toEqual(false));
    });

    test('return FALSE if argument has no `type` property or `type` property is falsy', () => {
        [{}, new Date(), { type: false }]
            .map(isAction)
            .forEach(result => expect(result).toEqual(false));
    });
});
