import { createSlice } from '../dist';

export const countSlice = createSlice('count', 0);

export const increment = countSlice.createAction('++', (draft: number) => {
  draft++;
  return draft;
});

export const decrement = countSlice.createAction('--', (draft: number) => {
  draft--;
  return draft;
});

export const countSelector = countSlice.selectState();
