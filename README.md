# Redux Dogma

**A dogmatic and declarative redux store manager**

![npm](https://img.shields.io/npm/dm/redux-dogma?style=flat) [![Maintainability](https://api.codeclimate.com/v1/badges/c0bca5d87dc8abcfe60a/maintainability)](https://codeclimate.com/github/devanfarrell/redux-dogma/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/c0bca5d87dc8abcfe60a/test_coverage)](https://codeclimate.com/github/devanfarrell/redux-dogma/test_coverage)

`npm install redux-dogma`

## Purpose

The **redux-dogma** project is a redux abstraction for rapid prototypes with a few goals in mind. First, is to have a strong typing abstraction for redux. All actions have typed payloads and reducer structures are propagated to the action handlers. The next goal is to ditch the `switch`. Low-level redux code makes following actions through code difficult, this is, in part, because reducers have to be mentally mapped to actions rather than being colocated. Finally, last goal was to remove as much boilerplate as possible.

This package is not a one size fits all solution to redux development. It comes built in with [redux-saga](https://www.npmjs.com/package/redux-saga) which is overkill for most applications.

## API Documentation

### Store Instantiation

```jsx
import * as React from 'react';
import { Provider } from 'react-redux';
import { createStoreAbstraction } from 'redux-dogma';

import { sliceExample } from './slices/sliceExample';

const store = createStoreAbstraction()
	.addSlice(sliceExample) // add all the created slices to the store
	.lockSideEffects() // call lockSideEffects once all slices have been added
	.getStore(); // getStore returns a store object from the abstraction

// If you're using redux add it to the provider as usual
const reduxProvider = ({ children }) => {
	return <Provider store={store}>{children}</Provider>;
};

export default reduxProvider;
```

### Reducer Instantiation

```ts
type DieState = 1 | 2 | 3 | 4 | 5 | 6;
const dieStates: DieState[] = [1, 2, 3, 4, 5, 6];

interface ReducerStructure {
	die1: DieState;
	die2: DieState;
	hasRolled: boolean;
}

export const diceSlice = createSlice<ReducerStructure>('dice', { die1: 1, die2: 1, hasRolled: false });
```

### Reducer Actions

Reducers use [immer](https://www.npmjs.com/package/immer) under the hood. There are pros and cons that come with this. Immutability is free out of the box but there isn't any way to opt out of immutability in this library. Also, because of this slices must be an object in order to maintain the proxy reference.

If you're using typescript, types are propagated from the slice creation and the createAction method call to action handler. If your action doesn't have a payload, use the `createSimpleAction` method.

```ts
export const rollDice = diceSlice.createSimpleAction('ROLL_DICE', (draft) => {
	const randomIndex1 = Math.round(Math.random() * 7776 - 1) % 6;
	const randomIndex2 = Math.round(Math.random() * 7776 - 1) % 6;
	draft.die1 = dieStates[randomIndex1];
	draft.die2 = dieStates[randomIndex2];
	draft.hasRolled = true;
});

interface CheatAction {
	die: 1 | 2;
	value: DieState;
}
export const cheat = diceSlice.createAction<CheatAction>('CHEAT', (draft, payload) => {
	if (payload.die === 1) {
		draft.die1 = payload.value;
	} else {
		draft.die2 = payload.value;
	}
});
```

### One Action to Many Slices

```ts
import { createAction } from 'redux-dogma';

export const resetDice = createAction('RESET_DICE');

// From dice slice
import { resetDice } from './sharedActions';

diceSlice.addAction(resetDice, (draft) => {
	draft.die1 = 1;
	draft.die2 = 1;
	draft.hasRolled = false;
});

// From other slice
exampleSlice.addAction(resetDice, (draft) => {
	draft.diceColorPreference = null;
});
```

### Side effects

Side effects use [redux-saga](https://www.npmjs.com/package/redux-saga).

```ts
import { effects } from 'redux-saga';

const tryToCheat = diceSlice.createSideEffect<DieState>("ATTEMPT_CHEAT", function(action)* {
  const succeed: boolean = !!!Math.round(Math.random());
  if(succeed) {
    yield effects.put(cheat(action.payload))
  } else {
    yield effects.put(rollDice());
  }
});
```

### Actions with reducers and side effects

```ts
export const changeNickName = createAction<{ nickName: string }>('CHANGE_NICKNAME');
slice.addAction(changeNickName, (draft, payload) => {
	state.nickName = payload;
});

slice.addSideEffect(changeNickName, function* (action) {
	const response = yield postChangeNickname(action.payload);
});
```

### Selectors

Selectors use the [reselect](https://www.npmjs.com/package/reselect) library. Type selection is also propagated from the slice.

```ts
import { createSelector } from 'reselect';
const rawSelector = diceSlice.selectState();
const redDie1 = createSelector([rawSelector], (state) => state.die1);
```

### Sub-slice Instantiation

```ts
import { createSlice } from 'redux-dogma';
import { diceSlice } from './diceSlice';
import { scoreSlice } from './scoreSlice';

export const sliceExample = createSlice('parentSliceExample').addSlice(stateSlice).addSlice(scoreSlice);
```
