import { stateFactory } from '../state-factory';

const booleanValidator = value => typeof value === 'boolean' || value instanceof Boolean;
export const booleanStateFactory = (initialValue = false) => stateFactory(initialValue, booleanValidator);
