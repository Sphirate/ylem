import { IllegalEnumValidatorValuesTypeError } from './errors';
import { stateFactory } from '../state-factory';

const enumValidatorFactory = (values) => {
    if (!values || !values.includes || typeof values.includes !== 'function') {
        throw new IllegalEnumValidatorValuesTypeError('Illegal ENUM state values. Check `includes` property');
    }
    return value => values.includes(value);
};
export const enumStateFactory =
    (values, initialValue) => stateFactory(initialValue, enumValidatorFactory(values));
