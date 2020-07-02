import { AnyAction, combineReducers, Reducer, ReducersMapObject } from 'redux';
import { Slice } from './slice';

export default class SliceManager {
	combinedReducer: Reducer;
	reducers: ReducersMapObject;
	slices: Slice<unknown>[];

	constructor() {
		this.reducers = {};
		this.combinedReducer = combineReducers(this.reducers);
		this.slices = [];
		this.reduce = this.reduce.bind(this);
		this.rootSaga = this.rootSaga.bind(this);
	}

	public addSlice(slice: Slice<unknown>): void {
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
