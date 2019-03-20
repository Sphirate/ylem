declare namespace Ylem {
    namespace Errors {
        class YlemError extends Error {}
        class YlemStateError extends YlemError {}
        class IllegalStateValueError extends YlemStateError {}
    }

    interface Errors {
        YlemError: Errors.YlemError;
        YlemStateError: Errors.YlemStateError;
        IllegalStateValueError: Errors.IllegalStateValueError;
    }

    namespace Subscription {
        interface Listener<T = any> {
            (state?: T, oldState?: T): void;
        }
        
        interface Unsubscriber {
            (): void;
        }
    }
    
    interface Subscription<T = any> {
        (listener: Subscription.Listener<T>): Subscription.Unsubscriber;
    }

    namespace State {
        interface Validator<T = any> {
            (value?: T): boolean;
        }

        interface Base<T = any> {
            (): T;
            readonly get: () => T;
            readonly onChange: Ylem.Subscription<T>;
            readonly onSyncChange: Ylem.Subscription<T>;
        }
        
        interface Factory<T = any> {
            (initialValue: T, validator: Validator<T>): State<T>;
        }
    }
   
    interface State<T = any> extends State.Base<T> {
        set: (value: T) => void;
        reset: () => void;
    }
}

declare module 'ylem' {
    export const stateFactory: Ylem.State.Factory;
    export const errors: Ylem.Errors;
}
