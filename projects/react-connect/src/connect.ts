import { BaseState } from "@ylem/core";
import * as React from "react";

interface StatesMap {
    [prop: string]: BaseState;
}

type UnwrappedStatesMap<M extends StatesMap> = {
    [K in keyof M]: ReturnType<M[K]["get"]>;
};

export const connect =
    <States extends StatesMap>(states: States) =>
        <ComponentProps extends UnwrappedStatesMap<States>>(Component: React.ComponentType<ComponentProps>) =>
            class extends React.Component<Omit<ComponentProps, keyof States>, States> {
                public static displayName: string = `Unwrapped(${ Component.displayName || Component.name || "NamelessComponent" })`;
                public state: Readonly<UnwrappedStatesMap<States>>;
                public unsubscribers: Array<() => void> = [];

                constructor(props: Omit<ComponentProps, keyof States>) {
                    super(props);
                    this.state = this.getState();

                    this.handleChange = this.handleChange.bind(this);
                }

                public getState() {
                    return Object.keys(states).reduce((acc, key) => ({ ...acc, [key]: states[key].get() }), {} as UnwrappedStatesMap<States>);
                }

                public handleChange() {
                    this.setState(this.getState());
                }

                public componentDidMount() {
                    this.unsubscribers = Object.values(states).map((state) => state.onChange.addListener(this.handleChange));
                }

                public componentWillUnmount() {
                    this.unsubscribers.forEach((unsubscribe) => unsubscribe());
                    this.unsubscribers = [];
                }

                public render() {
                    return React.createElement(Component, { ...this.props, ...this.state } as ComponentProps);
                }
            };
