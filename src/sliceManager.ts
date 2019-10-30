import { AnyAction, combineReducers, Reducer, ReducersMapObject } from 'redux';
import { Slice } from './slice';

export interface SliceManagerInterface {
  combinedReducer: Reducer;
  reducers: ReducersMapObject;
  slices: Array<unknown>;
  reduce(state: any, action: AnyAction): void;
  addSlice(slice: Slice): void;
}

export default class SliceManager implements SliceManagerInterface {
  combinedReducer: Reducer;
  reducers: ReducersMapObject;
  slices: Array<Slice>;

  constructor() {
    this.reducers = {};
    this.combinedReducer = combineReducers(this.reducers);
    this.slices = [];
    this.reduce = this.reduce.bind(this);
  }

  public addSlice(slice: Slice): void {
    slice.keyChain = [slice.key];
    this.reducers[slice.key] = slice.reduce;
    this.slices.push(slice);
    this.combinedReducer = combineReducers(this.reducers);
  }

  public reduce(state: any, action: AnyAction) {
    return this.combinedReducer(state, action);
  }
}
