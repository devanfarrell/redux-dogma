import { ActionGenerator, Slice, ActionMap, KeyedActionGenerator, KeyedAction } from './types';
import { AnyAction, combineReducers, Reducer, ReducersMapObject } from 'redux';
import { createSelector } from 'reselect';
import { takeEvery } from 'redux-saga/effects';
import produce from 'immer';

function accessNestedObject(nestedObject: any, keyChain: Array<string>): any {
  return keyChain.reduce(
    (obj: any, key: string) => (obj && obj[key] !== 'undefined' ? obj[key] : undefined),
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

class slice<ReducerStructure> implements Slice<ReducerStructure> {
  key: string;
  actionHandlers: ActionMap;
  keyScopedActionHandlers: ActionMap;
  sagaActionHandlers: Array<unknown>;
  initialState: any;
  keyChain: Array<string>;
  combinedReducer: Reducer;
  reducers: ReducersMapObject;
  slices: Array<Slice<unknown>>;
  resolved: Boolean;
  hasActions: Boolean;

  constructor(key: string, initialState?: any) {
    this.key = key;
    this.keyChain = [];
    this.actionHandlers = {};
    this.keyScopedActionHandlers = {};
    this.sagaActionHandlers = [];
    this.reducers = {};
    this.combinedReducer = combineReducers(this.reducers);
    this.initialState = initialState !== undefined ? initialState : {};
    this.reduce = this.reduce.bind(this);
    this.slices = [];
    this.resolved = false;
    this.hasActions = false;
  }

  public createAction<Payload>(
    actionName: string,
    callback: (draft: any, payload: Payload) => void
  ): KeyedActionGenerator<Payload> {
    this.hasActions = true;
    this.keyScopedActionHandlers[actionName] = callback;

    return (payload?: Payload): KeyedAction<Payload> => ({
      type: actionName,
      keyChain: this.keyChain,
      payload,
    });
  }

  public addAction(actionName: string, callback: Function): void {
    this.hasActions = true;
    this.actionHandlers[actionName] = callback;
  }

  public createSideEffect<Payload>(
    actionName: string,
    callback: GeneratorFunction
  ): ActionGenerator<Payload> {
    this.hasActions = true;
    const type = [...this.keyChain, actionName].join('/');
    this.sagaActionHandlers.push(takeEvery(type, callback));
    return (payload: any): AnyAction => ({
      type,
      payload,
    });
  }

  public selectState() {
    return createSelector(
      [state => accessNestedObject(state, this.keyChain)],
      data => data || null
    );
  }

  public reduce(state: ReducerStructure = this.initialState, action: AnyAction) {
    if (this.slices.length === 0) {
      return produce<ReducerStructure>(state, (draft: any) => {
        if (
          !!action.keyChain &&
          action.keyChain.length === this.keyChain.length &&
          keyChainCompare(action.keyChain, this.keyChain)
        ) {
          if (!!this.keyScopedActionHandlers[action.type]) {
            this.keyScopedActionHandlers[action.type](draft, action?.payload);
          }
        } else {
          if (!!this.actionHandlers[action.type]) {
            this.actionHandlers[action.type](draft, action?.payload);
          }
        }
        return draft;
      });
    } else {
      return this.combinedReducer(state, action);
    }
  }

  public addSlice<SubreducerStructure>(slice: Slice<SubreducerStructure>): Slice<ReducerStructure> {
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

  public *handleSaga(): IterableIterator<any> {
    for (let slice of this.slices) {
      yield* slice.handleSaga();
    }
    for (let handler of this.sagaActionHandlers) {
      yield handler;
    }
  }
}

export function createSlice<Structure>(key: string, initialState?: Structure) {
  return new slice<Structure>(key, initialState);
}
