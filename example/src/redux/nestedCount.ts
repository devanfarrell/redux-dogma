import { createSlice } from 'redux-dogma';
import { countSlice } from './count';
import { countSlice2 } from './count2';

export const countSliceParent = createSlice('countParent', {});
countSliceParent.addSlice(countSlice).addSlice(countSlice2);
