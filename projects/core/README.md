# @ylem/core

Core set of dependencies used in ylem projects

## Installation
```npm install --save @ylem/core```

To support old browsers you need to install `Promise`, `Map` and `Set` polyfills.

```npm install promise-polyfill```

```npm install es6-map```

```npm install es6-set```

## `BaseState` class

Base class used for every ylem state object.

Sometimes it's needed to determine if variable is ylem state or not. To do that you can do instance check against this class.
```javascript
import { BaseState } from "@ylem/core";

let variableValue;
if (variable instanceof BaseState) {
    variableValue = variable.get();
} else {
    variableValue = variable;
}
```
> This class is abstract and you shouldn't instanciate it directly.

This class has 3 properties:
- `get()` - methot that return current value of state. Not bounded to instance
- `onChange` - EventSource object from [`@ylem/event-source`](../event-sorce/README.md) package
- `onSyncChange` - EventSource object from [`@ylem/event-source`](../event-sorce/README.md) package

### `onChange` event source
`onChange` event source is designed to be main change event source. So, if you need to update your app based on state change, you should subscribe for event from `onChange` event source. All event dispatching asynchronously on `onChange` event source.

If state has changed several times synchronously, than it will trigger only one event on `onChange` event source. On the other hand, if state has changed several time synchronously and it's value equals value before changes were made, than no event will be dispatched on `onChange` event source. This made for listeners optimizations - no need to call listener if nothing changed.

The best way to get state actual value is to subscribe for `onChange` event source events.

```javascript
import { State } from "@ylem/state";

const comparator = (oldValue, newValue) => oldValue === newValue;
const validator = (value) => typeof value === "boolean";

const state = State.create(comparator, validator, false);

let stateValue = state.get();
state.onChange.addListener(() => {
    stateValue = state.get();
});

state.set(true);
```

> `onChange` event source dispatches events without any payload. That means you need to get state value by yourself.

Another optimization is that one event listener will be called only once while subscribed on several states event sources and every state were changed.

```javascript
// In this example listener will be called once
import { State } from "@ylem/state";

const comparator = (oldValue, newValue) => oldValue === newValue;
const validator = (value) => typeof value === "boolean";

const state1 = State.create(comparator, validator, false);
const state2 = State.create(comparator, validator, false);

let stateValue1 = state1.get();
let stateValue2 = state2.get();

const listener = () => {
    stateValue1 = state1.get();
    stateValue2 = state2.get();
};

state1.onChange.addListener(listener);
state2.onChange.addListener(listener);

state1.set(true);
state2.set(true);
```

### `onSyncChange` event source
`onSyncChange` event source is designed to be used for updating one state right after another state change. All attached listeners will be called right after state changed. Event on `onSyncChange` event source won't be dispatched if state value before change equals state value after change.

> Unlike `onChange` event source, listeners attahced to `onSyncChange` event sources will be called for every meaningful event on `onChange` event sources change for every state.

```javascript
import { State } from "@ylem/state";

const comparator = (oldValue, newValue) => oldValue === newValue;
const validator = (value) => typeof value === "boolean";

const state1 = State.create(comparator, validator, false);
const state2 = State.create(comparator, validator, false);

let stateValue1 = state1.get();
let stateValue2 = state2.get();

// `listener` will be called once
const listener = () => {
    stateValue1 = state1.get();
    stateValue2 = state2.get();
};

state1.onChange.addListener(listener);
state2.onChange.addListener(listener);

// When `state1` updates it's value, state2 updates it's value too
state1.onSyncChange.addListener(() => state2.set(state1.get()));

state1.set(true);
```

## `BaseChangeableState` class

`BaseChangeableState` class extends `BaseState` class and is designed to be used to determine if variable is changeable state.
```javascript
import { BaseChangeableState } from "@ylem/core";

if (variable instanceof BaseChangeableState) {
    variable.set(value);
} else {
    variable = value;
}
```

## `stateChanged` function

`stateChanged` function is used to dispatch meaningful delayed events on `onChange` event sources. You don't need to use that function in your app until you decide to create your own state class based on `ylem` ecosystem.