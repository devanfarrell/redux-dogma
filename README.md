## API Goals

```js
const store = createStoreAbstraction();
const userSlice = createSlice('user', { dataPoints: [], nickName: '' });
store.addSlice(userSlice);
```

### Reducer Concepts

```js
export const addDataPoint = slice.createAction(
  'ADD_DATA_POINT',
  (state, payload) => {
    state.dataPoints.push(payload);
  }
);

export const [CHANGE_NICKNAME, changeNickName] = createAction(
  'CHANGE_NICKNAME'
);
slice.addAction(CHANGE_NICKNAME, (state, payload) => {
  state.nickName = payload;
});
```

### Saga Concepts

```js
export const addDataPoint = slice.createSideEffect('ADD_DATA_POINT', function*(
  payload
) {
  const response = yield postNewDataPoint(payload);
});

export const changeNickName = slice.createDebouncedSideEffect(
  'CHANGE_NICKNAME',
  function*(payload) {
    const response = yield changeNickname(payload);
  }
);
```

```js
export const [ADD_DATA_POINT, addDataPoint] = createAction('ADD_DATA_POINT');
export const [CHANGE_NICKNAME, changeNickName] = createAction(
  'CHANGE_NICKNAME'
);

slice.addSideEffect(ADD_DATA_POINT, function*(payload) {
  const response = yield postNewDataPoint(payload);
});

slice.addDebouncedSideEffect(CHANGE_NICKNAME, function*(payload) {
  const response = yield changeNickname(payload);
});
```

### Actions with reducers and side effects

```js
export const [CHANGE_NICKNAME, changeNickName] = createAction(
  'CHANGE_NICKNAME'
);
slice.addAction(CHANGE_NICKNAME, (state, payload) => {
  state.nickName = payload;
});

slice.addDebouncedSideEffect(CHANGE_NICKNAME, function*(payload) {
  const response = yield changeNickname(payload);
});
```

### Custom effects

```js
slice.addCustomEffect(function*() {
  yield take('event1');
  yield take('event2');
  console.log('conditions met');
});
```

### Selectors

```js
const selectUser = slice.getSelector();

const selectNickName = createSelector([selectUser], user => user.nickName);
```

### Sub Slices

```js
const store = store.createSlice('user');
const dataPointsSlice = createSlice('dataPoints', []);
const nickNameSlice = createSlice('nickname', '');
store.addSlice(dataPointsSlice).addSlice(nickNameSlice);
```
