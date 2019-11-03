import * as React from 'react';
import { Provider } from 'react-redux';
import { createStoreAbstraction } from 'redux-dogma';

import { countSlice } from './count';
import { countSlice2 } from './count2';

const abstraction = createStoreAbstraction();
abstraction.addSlice(countSlice).addSlice(countSlice2);

const reduxProvider = ({ children }) => {
  return <Provider store={abstraction.store}>{children}</Provider>;
};

export default reduxProvider;
