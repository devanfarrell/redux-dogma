import { createStore, Store, applyMiddleware, StoreEnhancer } from 'redux';
import { Slice, SliceManagerInterface, StoreAbstraction } from './types';

import { composeWithDevTools } from 'redux-devtools-extension';
import SliceManager from './sliceManager';
import ReduxSaga, { SagaMiddleware } from 'redux-saga';

class storeAbstraction implements StoreAbstraction {
  sliceManager: SliceManagerInterface;
  store: Store;
  reduxSaga: SagaMiddleware;
  unappliedMiddleware: Array<any>;
  middleware: StoreEnhancer;

  constructor() {
    const isProduction: boolean = process.env.NODE_ENV === 'production';
    this.sliceManager = new SliceManager();
    this.reduxSaga = ReduxSaga();
    this.unappliedMiddleware = [this.reduxSaga];
    if (isProduction) {
      this.middleware = applyMiddleware(...this.unappliedMiddleware);
    } else {
      const composeEnhancers = composeWithDevTools({
        /*OPTIONS*/
      });
      this.middleware = composeEnhancers(
        applyMiddleware(...this.unappliedMiddleware)
      );
    }
    this.store = createStore(this.sliceManager.reduce, this.middleware);
    this.reduxSaga.run(this.sliceManager.rootSaga);
  }

  getRawStore(): Store {
    return this.store;
  }

  addSlice(slice: Slice): StoreAbstraction {
    slice.keyChain = [slice.key];
    this.sliceManager.addSlice(slice);
    this.store.dispatch({
      type: '@@redux-dogma: init-slice',
      payload: { key: slice.key },
    });
    return this;
  }
}

export function createStoreAbstraction() {
  return new storeAbstraction();
}
