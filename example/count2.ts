import { createSlice } from '../dist';
import { CLEAR_INCREMENTS } from './sharedActions';

export const countSlice2 = createSlice('count2', 0);

export const increment2 = countSlice2.createAction('++', (draft: number) => {
  draft++;
  return draft;
});

export const decrement2 = countSlice2.createAction('--', (draft: number) => {
  draft--;
  return draft;
});

countSlice2.addAction(CLEAR_INCREMENTS, (draft: number) => {
  draft = 0;
  return draft;
});

export const countSelector2 = countSlice2.selectState();
