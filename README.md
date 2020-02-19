# Redux Dogma

**A dogmatic and declaritive redux store manager**

![npm](https://img.shields.io/npm/dm/redux-dogma?style=flat-square)

`npm install @reduxjs/toolkit`

## Purpose

The **redux-dogma** project is a redux abstraction for rapid prototypes with two goals in mind. The first goal is to ditch the `switch`. Standard redux code makes following actions through code difficult. This is, in part, because reducers have to be mentally mapped to actions rather than being colocated. The second goal was to remove as much boilerplate as possible.

This package is not a one size fits all solution to redux development. It comes built in with [redux-dogma](https://www.npmjs.com/package/redux-saga) which is overkill for most applications. This may become optional in the future.

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
}

export const sliceExample = createSlice<ReducerStructure>('playerStructure', { die1: 1, die2: 1 });
```

### Reducer Actions

Reducers use [immer](https://www.npmjs.com/package/immer) under the hood. There are pros and cons that come with this. Immutability is free out of the box but there isn't really any way to opt out of it. Also, because of this slices must be an object in order to maintain the proxy reference.

If you're using typescript, types are propagated from the slice creation and the createAction method call to action handler.

```ts
export const rollDice = playerSelectionSlice.createAction<undefined>('ROLL_DICE', draft => {
  const randomIndex1 = Math.round(Math.random() * 7776 - 1) % 6;
  const randomIndex2 = Math.round(Math.random() * 7776 - 1) % 6;
  draft.die1 = dieStates[randomIndex1];
  draft.die2 = dieStates[randomIndex2];
});

interface CheatAction {
  die: 1 | 2;
  value: DieState;
}
export const cheat = playerSelectionSlice.createAction<CheatAction>('CHEAT', (draft, payload) => {
  if (payload.die === 1) {
    draft.die1 = payload.value;
  } else {
    draft.die2 = payload.value;
  }
});
```

### One Action to Many Slices



### Actions with reducers and side effects

```js
export const [CHANGE_NICKNAME, changeNickName] = createAction('CHANGE_NICKNAME');
slice.addAction(CHANGE_NICKNAME, (state, payload) => {
  state.nickName = payload;
});

slice.addDebouncedSideEffect(CHANGE_NICKNAME, function*(payload) {
  const response = yield changeNickname(payload);
});
```

### Selectors

### Sub-slice Instantiation 
