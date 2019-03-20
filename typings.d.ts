// declare namespace Ylem {
//     interface Action<T, P extends any = never> {
//         type: T;
//         payload?: P;
//     }
//     type Dispatch = <A, P>(...actions: Action<A, P>[]) => never;
    
//     type Subscription = () => any;
//     type Unsibscribe = () => never;

//     interface Reducer<S> {
//         (): () => S;
//         subscribe: (listener: Subscription) => Unsibscribe;
//         getSubscriptions: () => Subscription[];
//     }

//     type ReducerHandler<S, A, P> = (state: S, action: Action<A, P>) => S;
//     type CreateReducer = <S = any, A = string, P = never>(reducer: ReducerHandler<S, A, P>, actions: A[]) => Reducer<S>;

//     type CombineReducers = <S = any>(map: { [key: string]: Reducer<S> }) => () => { [key: string]: S };
// }

// declare module ylem {
//     export const createReducer: Ylem.CreateReducer;
//     export const combineReducers: Ylem.CombineReducers;
//     export const dispatch: Ylem.Dispatch;
// }

// export default ylem;
