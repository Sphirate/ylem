import * as React from "react";
import { BaseState } from "@ylem/core";

interface StatesMap {
    [prop: string]: BaseState;
}

type UnwrappedStatesMap<M extends StatesMap> = {
    [K in keyof M]: ReturnType<M[K]["get"]>;
}

export const connect =
    <States extends StatesMap>(states: States) =>
        <ComponentProps extends UnwrappedStatesMap<States>>(Component: React.ComponentType<ComponentProps>) =>
            class extends React.Component<Omit<ComponentProps, keyof States>, States> {
                state: Readonly<UnwrappedStatesMap<States>>;
                unsubscribers: Array<() => void> = [];

                constructor(props: Omit<ComponentProps, keyof States>) {
                    super(props);
                    this.state = this.getState();

                    this.handleChange = this.handleChange.bind(this);
                }

                getState() {
                    return Object.keys(states).reduce((acc, key) => ({ ...acc, [key]: states[key].get() }), {} as UnwrappedStatesMap<States>);
                }

                handleChange() {
                    this.setState(this.getState());
                }

                componentDidMount() {
                    this.unsubscribers = Object.values(states).map((state) => state.onChange.addListener(this.handleChange));
                }

                componentWillUnmount() {
                    this.unsubscribers.forEach((unsubscribe) => unsubscribe());
                    this.unsubscribers = [];
                }

                render() {
                    return React.createElement(Component, { ...this.props, ...this.state } as ComponentProps);
                }
            };
