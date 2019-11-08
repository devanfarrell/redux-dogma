import { AnyAction, combineReducers, Reducer, ReducersMapObject } from 'redux';
import { Slice, SliceManagerInterface } from './types';
import { takeEvery } from 'redux-saga/effects';

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
    slice.resolveSlice([]);
    this.slices.push(slice);
    this.reducers[slice.key] = slice.reduce;
    this.combinedReducer = combineReducers(this.reducers);
  }

  public reduce(state: any, action: AnyAction) {
    return this.combinedReducer(state, action);
  }

  public *rootSaga(): IterableIterator<any> {
    yield takeEvery('@@redux-dogma: init-slice', function*(action: AnyAction) {
      yield console.debug(action);
    });
  }
}
