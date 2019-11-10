import * as React from 'react';
import { Provider } from 'react-redux';
import { createStoreAbstraction } from 'redux-dogma';

import { countSliceParent } from './nestedCount';

const store = createStoreAbstraction()
  .addSlice(countSliceParent)
  .lockSideEffects()
  .getStore();

const reduxProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default reduxProvider;
