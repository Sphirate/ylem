import { stateFactory } from '../state-factory';

const numberValidator = value => typeof value === 'number' || value instanceof Number;
export const numberStateFactory = (initialValue = 0) => stateFactory(initialValue, numberValidator);
