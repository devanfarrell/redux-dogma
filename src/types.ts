import {
  AnyAction,
  Reducer,
  ReducersMapObject,
  Store,
  StoreEnhancer,
} from 'redux';

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
  // combinedReducer: Reducer;
  initialState: any;
  key: string;
  keyChain: Array<string>;
  keyScopedActionHandlers: ActionMap;
  // reducers: ReducersMapObject;
  reduce(state: any, action: AnyAction): void;
  createAction(actionName: string, callback: Function): ActionGenerator;
  addAction(actionName: string, callback: Function): void;
  selectState(): unknown;
  // addSlice(slice: Slice): void;
}

export interface SliceManagerInterface {
  combinedReducer: Reducer;
  reducers: ReducersMapObject;
  slices: Array<unknown>;
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
