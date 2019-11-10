import { createSlice, createSelector } from 'redux-dogma';
import { CLEAR_INCREMENTS } from './sharedActions';

interface Incrementor {
  increments: number;
  decrements: number;
}

const initialState: Incrementor = {
  increments: 0,
  decrements: 0,
};

export const countSlice = createSlice('count', initialState);

export const increment = countSlice.createAction('++', (draft: Incrementor) => {
  draft.increments++;
  return draft;
});

export const decrement = countSlice.createAction('--', (draft: Incrementor) => {
  draft.decrements++;
  return draft;
});

countSlice.addAction(CLEAR_INCREMENTS, (draft: Incrementor) => {
  draft = initialState;
  return draft;
});

export const rawIncrementorSelector = countSlice.selectState();

export const countSelector: any = createSelector(
  [rawIncrementorSelector],
  (increments: Incrementor) => {
    return increments.increments - increments.decrements;
  }
);

export const countSideEffect = countSlice.createSideEffect('BOOM', function*() {
  yield console.debug('BOOM DA BOOM BOOM');
});
