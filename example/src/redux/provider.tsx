import * as React from 'react';
import { Provider } from 'react-redux';
import { createStoreAbstraction } from 'redux-dogma';

import { countSliceParent } from './nestedCount';

const abstraction = createStoreAbstraction();
abstraction.addSlice(countSliceParent);

const reduxProvider = ({ children }) => {
  return <Provider store={abstraction.store}>{children}</Provider>;
};

export default reduxProvider;
