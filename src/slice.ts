import { ActionGenerator, Slice, ActionMap } from './types';
import { AnyAction, combineReducers, Reducer, ReducersMapObject } from 'redux';
import { createSelector } from 'reselect';
import produce from 'immer';

export interface KeyedAction extends AnyAction {
  keyChain: Array<string>;
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
  initialState: any;
  key: string;
  keyChain: Array<string>;
  keyScopedActionHandlers: ActionMap;
  combinedReducer: Reducer;
  reducers: ReducersMapObject;
  slices: Array<Slice>;
  resolved: Boolean;
  hasActions: Boolean;

  constructor(key: string, initialState?: any) {
    this.key = key;
    this.keyChain = [];
    this.actionHandlers = {};
    this.keyScopedActionHandlers = {};
    this.reducers = {};
    this.combinedReducer = combineReducers(this.reducers);
    this.initialState = initialState !== undefined ? initialState : {};
    this.reduce = this.reduce.bind(this);
    this.slices = [];
    this.resolved = false;
    this.hasActions = false;
  }

  public createAction(actionName: string, callback: Function): ActionGenerator {
    this.hasActions = true;
    this.keyScopedActionHandlers[actionName] = callback;
    return (payload: any): AnyAction => ({
      type: actionName,
      keyChain: this.keyChain,
      payload,
    });
  }

  public addAction(actionName: string, callback: Function): void {
    this.hasActions = true;
    this.actionHandlers[actionName] = callback;
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
    if (this.slices.length === 0) {
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
    } else {
      return this.combinedReducer(state, action);
    }
  }

  public addSlice(slice: Slice): Slice {
    this.slices.push(slice);
    if (this.resolved) {
      slice.resolveSlice(this.keyChain);
      this.reducers[slice.key] = slice.reduce;
      this.combinedReducer = combineReducers(this.reducers);
    }
    return this;
  }

  public resolveSlice(keyChain: Array<string>) {
    this.keyChain = [...keyChain, this.key];
    this.resolved = true;
    if (this.hasActions && this.slices.length > 0) {
      throw new Error(`ERROR: ${this.key} has both actions and sub slices.
      You probably should move the actions to another sub slice
      Slice path: ${this.keyChain}`);
    }
    this.slices.forEach(slice => {
      slice.resolveSlice(this.keyChain);
      this.reducers[slice.key] = slice.reduce;
      this.combinedReducer = combineReducers(this.reducers);
    });
  }
}

export const createSlice = (key: string, initialState?: any): Slice =>
  new slice(key, initialState);
