import { createSlice } from 'redux-dogma';
import { CLEAR_INCREMENTS } from './sharedActions';

export const countSlice = createSlice('count', 0);

export const increment = countSlice.createAction('++', (draft: number) => {
  draft++;
  return draft;
});

export const decrement = countSlice.createAction('--', (draft: number) => {
  draft--;
  return draft;
});

countSlice.addAction(CLEAR_INCREMENTS, (draft: number) => {
  draft = 0;
  return draft;
});

export const countSelector: any = countSlice.selectState();
