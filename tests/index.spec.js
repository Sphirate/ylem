import * as ylem from './../src/index';

test('Index file exports factory functions', () => {
    expect(ylem).toEqual(expect.objectContaining({
        combineReducers: expect.any(Function),
        createReducer: expect.any(Function),
        createStore: expect.any(Function),
    }));
});
