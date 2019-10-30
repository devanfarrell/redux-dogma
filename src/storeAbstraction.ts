import { createStore, Store, applyMiddleware, StoreEnhancer } from 'redux';
import { Slice } from './slice';

import { composeWithDevTools } from 'redux-devtools-extension';
import SliceManager, { SliceManagerInterface } from './sliceManager';
import ReduxSaga from 'redux-saga';

export interface StoreAbstraction {
  sliceManager: SliceManagerInterface;
  store: Store;
  reduxSaga: unknown;
  unappliedMiddleware: Array<unknown>;
  middleware: StoreEnhancer;
  getRawStore(): Store;
  addSlice(slice: Slice): StoreAbstraction;
}

class storeAbstraction implements StoreAbstraction {
  sliceManager: SliceManagerInterface;
  store: Store;
  reduxSaga: unknown;
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
  }

  getRawStore(): Store {
    return this.store;
  }

  addSlice(slice: Slice): StoreAbstraction {
    slice.keyChain = [slice.key];
    this.sliceManager.addSlice(slice);
    this.store.dispatch({ type: '@@redux-dogma slice-init' });
    return this;
  }
}

export const createStoreAbstraction = () => new storeAbstraction();
