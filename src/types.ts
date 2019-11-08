import {
  AnyAction,
  Reducer,
  ReducersMapObject,
  Store,
  StoreEnhancer,
} from 'redux';

import { ParametricSelector } from 'reselect';

export interface KeyedAction extends AnyAction {
  keyChain: Array<string>;
}

export interface ActionGenerator {
  (payload?: any): AnyAction | KeyedAction;
}

export interface ActionMap {
  [actionName: string]: Function;
}

export interface Slice {
  actionHandlers: ActionMap;
  initialState: any;
  key: string;
  keyChain: Array<string>;
  keyScopedActionHandlers: ActionMap;
  combinedReducer: Reducer;
  reducers: ReducersMapObject;
  slices: Array<Slice>;
  reduce(state: any, action: AnyAction): void;
  createAction(actionName: string, callback: Function): ActionGenerator;
  addAction(actionName: string, callback: Function): void;
  addSlice(slice: Slice): Slice;
  selectState(): ParametricSelector<any, unknown, unknown> | undefined;
  resolveSlice(keyChain: Array<string>): void;
}

export interface SliceManagerInterface {
  combinedReducer: Reducer;
  reducers: ReducersMapObject;
  slices: Array<Slice>;
  reduce(state: any, action: AnyAction): void;
  addSlice(slice: Slice): void;
  rootSaga(): IterableIterator<any>;
}

export interface StoreAbstraction {
  sliceManager: SliceManagerInterface;
  store: Store;
  reduxSaga: unknown;
  unappliedMiddleware: Array<unknown>;
  middleware: StoreEnhancer;
  getRawStore(): Store;
  addSlice(slice: Slice): StoreAbstraction;
}
