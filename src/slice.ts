import { AnyAction } from 'redux';
import { createSelector } from 'reselect';
import produce from 'immer';

export interface KeyedAction extends AnyAction {
  keyChain: Array<string>;
}

export interface ActionMap {
  [actionName: string]: Function;
}

export interface ActionGenerator {
  (payload?: any): AnyAction | KeyedAction;
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
  selectState(): unknown;
  // addSlice(slice: Slice): void;
}

function accessNestedObject(nestedObject: any, keyChain: Array<string>): any {
  return keyChain.reduce(
    (obj: any, key: string) =>
      obj && obj[key] !== 'undefined' ? obj[key] : undefined,
    nestedObject
  );
}

function keyChainCompare(keys1: Array<string>, keys2: Array<string>): Boolean {
  for (let i in keys1) {
    if (keys1[i] !== keys2[i]) {
      return false;
    }
  }
  return true;
}

class slice implements Slice {
  actionHandlers: ActionMap;
  // combinedReducer: Reducer;
  initialState: any;
  key: string;
  keyChain: Array<string>;
  keyScopedActionHandlers: ActionMap;
  // reducers: ReducersMapObject | null;

  constructor(key: string, initialState?: any) {
    this.key = key;
    this.keyChain = [];
    this.actionHandlers = {};
    this.keyScopedActionHandlers = {};
    // this.reducers = {};
    // this.combinedReducer = combineReducers(this.reducers);
    this.initialState = initialState !== undefined ? initialState : {};
    this.reduce = this.reduce.bind(this);
  }

  public createAction(actionName: string, callback: Function): ActionGenerator {
    this.keyScopedActionHandlers[actionName] = callback;
    return (payload: any): AnyAction => ({
      type: actionName,
      keyChain: this.keyChain,
      payload,
    });
  }

  public addAction(actionName: string, callback: Function) {
    this.actionHandlers[actionName] = callback;
    return (payload: any): AnyAction => ({
      type: actionName,
      payload,
    });
  }

  public selectState() {
    return createSelector(
      [state => accessNestedObject(state, this.keyChain)],
      data => data || null
    );
  }

  public reduce(
    state: any = this.initialState,
    action: AnyAction | KeyedAction
  ) {
    return produce(state, (draft: any) => {
      if (
        !!action.keyChain &&
        action.keyChain.length === this.keyChain.length &&
        keyChainCompare(action.keyChain, this.keyChain)
      ) {
        if (!!this.keyScopedActionHandlers[action.type]) {
          draft = this.keyScopedActionHandlers[action.type](draft, action);
        }
      } else {
        if (!!this.actionHandlers[action.type]) {
          draft = this.actionHandlers[action.type](draft, action);
        }
      }
      return draft;
    });
  }
}

export const createSlice = (key: string, initialState?: any): Slice =>
  new slice(key, initialState);
