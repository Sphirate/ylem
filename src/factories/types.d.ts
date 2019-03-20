declare namespace Ylem.Factories {
    namespace Errors {
        class IllegalEnumValidatorValuesTypeError extends Ylem.Errors.YlemError {}
    }
    interface Errors {
        IllegalEnumValidatorValuesTypeError: Errors.IllegalEnumValidatorValuesTypeError;
    }
    
    interface Number {
        (initialValue: number): Ylem.State<number>;
    }

    interface Boolean {
        (initialValue: boolean): Ylem.State<boolean>;
    }

    namespace Enum {
        interface EnumValuesList<T = any> {
            includes: (value: T) => boolean;
        }
    }
    interface Enum<T = any> {
        (values: Enum.EnumValuesList<T>, initialValue: T): Ylem.State<T>;
    }
}

declare module 'ylem-factories' {
    export const numberStateFactory: Ylem.Factories.Number;
    export const booleanStateFactory: Ylem.Factories.Boolean;
    export const enumStateFactory: Ylem.Factories.Enum;
    export const errors: Ylem.Factories.Errors;
}
