import { AnyAction, Reducer, ReducersMapObject, Store, StoreEnhancer } from 'redux';

import { ParametricSelector } from 'reselect';

export interface Action<Payload> {
  type: string;
  payload?: Payload;
}

export interface KeyedAction<Payload> {
  type: string;
  keyChain: Array<string>;
  payload?: Payload;
}

export interface ActionGenerator<Payload = null> {
  (payload: Payload): Action<Payload>;
}

export interface KeyedActionGenerator<Payload> {
  (payload: Payload): KeyedAction<Payload>;
}
export interface ActionMap {
  [actionName: string]: Function;
}

export interface Slice<ReducerStructure> {
  initialState: ReducerStructure;
  key: string;
  keyChain: Array<string>;
  reduce(state: ReducerStructure, action: AnyAction): void;
  createAction<Payload>(
    actionName: string,
    callback: (draft: ReducerStructure, payload: Payload) => void
  ): KeyedActionGenerator<Payload>;
  addAction<Payload>(
    actionName: string,
    callback: (draft: ReducerStructure, payload: Payload) => void
  ): ActionGenerator<Payload>;
  addSlice(slice: Slice<unknown>): Slice<unknown>;
  selectState(): ParametricSelector<any, unknown, unknown> | undefined;
  resolveSlice(keyChain: Array<string>): void;
  handleSaga(): IterableIterator<any>;
  createSideEffect<Payload>(
    actionName: string,
    callback: () => Generator<any, void, unknown>
  ): ActionGenerator<Payload>;
}

export interface SliceManagerInterface {
  combinedReducer: Reducer;
  reducers: ReducersMapObject;
  slices: Array<Slice<unknown>>;
  reduce(state: any, action: AnyAction): void;
  addSlice(slice: Slice<unknown>): void;
  rootSaga(): IterableIterator<any>;
}

export interface StoreAbstraction {
  sliceManager: SliceManagerInterface;
  reduxSaga: unknown;
  unappliedMiddleware: Array<unknown>;
  middleware: StoreEnhancer;
  getStore(): Store;
  addSlice(slice: Slice<unknown>): StoreAbstraction;
  lockSideEffects(): StoreAbstraction;
}
