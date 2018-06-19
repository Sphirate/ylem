import { createReducer } from './../src/create-reducer';

describe('createReducer', () => {
    it('should exist', () => expect(createReducer).toBeDefined());
    it('should be a function', () => expect(typeof createReducer).toBe('function'));
});
