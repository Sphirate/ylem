declare namespace Ylem.Combiners {
    interface CombinedState<T = any> extends Ylem.State.Base<T> {
        readonly destroy: () => void;
    }

    namespace ObjectCombiner {
        type keyType = string | number | Symbol;

        interface State<T = object> extends CombinedState<T> {
            readonly add: (state: Ylem.State | CombinedState, key: keyType) => void;
            readonly remove: (key: keyType) => void;
        }

        namespace Arguments {
            type Map<T> = {
                [K in keyof T]: Ylem.State.Base<T[K]>;
            }
        }
    }

    interface ObjectCombiner<T = {}> {
        (map: ObjectCombiner.Arguments.Map<T>): ObjectCombiner.State
    }

    namespace ArrayCombiner {
        interface State<T = Array<any>> extends CombinedState<T> {
            readonly unshift: (...states: Array<Ylem.State.Base>) => void;
            readonly push: (...states: Array<Ylem.State.Base>) => void;
            readonly shift: () => Ylem.State.Base;
            readonly pull: () => Ylem.State.Base;
            readonly length: number;
        }
    }

    interface ArrayCombiner<T = []> {
        (list: Array<Ylem.State.Base>): ArrayCombiner.State<T>;
    }

    namespace CustomCombiner {
        interface State<T = any> extends CombinedState<T> {
            readonly add: (state: Ylem.State.Base) => void;
            readonly remove: (state: Ylem.State.Base) => void;
        }

        namespace Arguments {
            type StatesList = Array<Ylem.State.Base>;
            
            interface Transformer<T> {
                (states: StatesList, currentState: T): T;
            }
        }
    }

    interface CustomCombiner<T = any> {
        (states: CustomCombiner.Arguments.StatesList, transformFn: CustomCombiner.Arguments.Transformer<T>): CustomCombiner.State<T>;
    }
}

declare module 'ylem-combiners' {
    export const objectCombiner: Ylem.Combiners.ObjectCombiner;
    export const arrayCombiner: Ylem.Combiners.ArrayCombiner;
    export const customCombiner: Ylem.Combiners.CustomCombiner;
}
