import { AnyAction, combineReducers, Reducer, ReducersMapObject } from 'redux';
import { Slice, SliceManagerInterface } from './types';

export default class SliceManager implements SliceManagerInterface {
  combinedReducer: Reducer;
  reducers: ReducersMapObject;
  slices: Array<Slice>;

  constructor() {
    this.reducers = {};
    this.combinedReducer = combineReducers(this.reducers);
    this.slices = [];
    this.reduce = this.reduce.bind(this);
    this.rootSaga = this.rootSaga.bind(this);
  }

  public addSlice(slice: Slice): void {
    slice.resolveSlice([]);
    this.slices.push(slice);
    this.reducers[slice.key] = slice.reduce;
    this.combinedReducer = combineReducers(this.reducers);
  }

  public reduce(state: any, action: AnyAction) {
    return this.combinedReducer(state, action);
  }

  public *rootSaga(): IterableIterator<any> {
    for (let slice of this.slices) {
      yield* slice.handleSaga();
    }
  }
}
