import { ActionGenerator, Slice, ActionMap, KeyedActionGenerator, KeyedAction } from './types';
import { AnyAction, combineReducers, Reducer, ReducersMapObject } from 'redux';
import { createSelector } from 'reselect';
import { takeEvery, ForkEffect } from 'redux-saga/effects';
import { keyChainCompare, accessNestedObject } from './utility';
import produce from 'immer';

class slice<ReducerStructure> implements Slice<ReducerStructure> {
  key: string;
  actionHandlers: ActionMap;
  keyScopedActionHandlers: ActionMap;
  sagaActionHandlers: Array<ForkEffect>;
  initialState: any;
  keyChain: Array<string>;
  combinedReducer: Reducer;
  reducers: ReducersMapObject;
  slices: Array<Slice<unknown>>;
  resolved: Boolean;
  hasActions: Boolean;

  constructor(key: string, initialState?: ReducerStructure) {
    this.key = key;
    this.keyChain = [];
    this.actionHandlers = {};
    this.keyScopedActionHandlers = {};
    this.sagaActionHandlers = [];
    this.reducers = {};
    this.combinedReducer = combineReducers(this.reducers);
    this.initialState = initialState ?? {};
    this.reduce = this.reduce.bind(this);
    this.slices = [];
    this.resolved = false;
    this.hasActions = false;
  }

  public createAction<Payload>(
    actionName: string,
    callback: (draft: ReducerStructure, payload: Payload) => void
  ): KeyedActionGenerator<Payload> {
    this.hasActions = true;
    this.keyScopedActionHandlers[actionName] = callback;

    return (payload?: Payload): KeyedAction<Payload> => ({
      type: actionName,
      keyChain: this.keyChain,
      payload,
    });
  }

  public addAction<Payload>(actionName: string, callback: (draft: ReducerStructure, payload: Payload) => void): void {
    this.hasActions = true;
    this.actionHandlers[actionName] = callback;
  }

  public createSideEffect<Payload>(
    actionName: string,
    callback: (action: KeyedAction<Payload>) => any
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
    return createSelector([state => accessNestedObject(state, this.keyChain)], data => data || null);
  }

  public reduce(state: ReducerStructure = this.initialState, action: AnyAction) {
    // If this slice doesn't have subslices, run resolvers on this reducer
    if (this.slices.length === 0) {
      return produce<ReducerStructure>(state, (draft: any) => {
        if (keyChainCompare(action?.keyChain, this.keyChain)) {
          // if the keychain matches use the resolver
          if (!!this.keyScopedActionHandlers[action.type]) {
            this.keyScopedActionHandlers[action.type](draft, action?.payload);
          }
        } else if (!action?.keyChain) {
          // if the keychain doesn't exist, see if there is a resolver
          if (!!this.actionHandlers[action.type]) {
            this.actionHandlers[action.type](draft, action?.payload);
          }
        }
        return draft;
      });
      // if there are subslices, combine reducers on subslices
    } else {
      return this.combinedReducer(state, action);
    }
  }

  public addSlice<SubreducerStructure>(slice: Slice<SubreducerStructure>): Slice<ReducerStructure> {
    // Add the subslice to the list of sub slices
    this.slices.push(slice);
    // if this slice is already resolved, resolve the new subslice
    if (this.resolved) {
      slice.resolveSlice(this.keyChain);
      this.reducers[slice.key] = slice.reduce;
      this.combinedReducer = combineReducers(this.reducers);
    }
    return this;
  }

  public resolveSlice(keyChain: Array<string>) {
    // Create the keychain
    this.keyChain = [...keyChain, this.key];
    this.resolved = true;
    if (this.hasActions && this.slices.length > 0) {
      throw new Error(`ERROR: ${this.key} has both actions and sub slices.
      You must move the actions to another sub slice
      Slice path: ${this.keyChain}`);
    }
    // recursively resolve sub-slices
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
