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

export const countSlice2 = createSlice('count2', initialState);

export const increment2 = countSlice2.createAction(
  '++',
  (draft: Incrementor) => {
    draft.increments++;
    return draft;
  }
);

export const decrement2 = countSlice2.createAction(
  '--',
  (draft: Incrementor) => {
    draft.decrements++;
    return draft;
  }
);

countSlice2.addAction(CLEAR_INCREMENTS, (draft: Incrementor) => {
  draft = initialState;
  return draft;
});

export const rawIncrementorSelector = countSlice2.selectState();

export const countSelector2: any = createSelector(
  [rawIncrementorSelector],
  (increments: Incrementor) => {
    return increments.increments - increments.decrements;
  }
);
