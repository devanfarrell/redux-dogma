import { AnyAction, Reducer, ReducersMapObject, Store, StoreEnhancer } from 'redux';
import { Draft } from 'immer';

import { ParametricSelector } from 'reselect';

export interface Action<Payload> {
	type: string;
	payload?: Payload;
}

export interface KeyedAction<Payload> {
	type: string;
	keyChain: Array<string>;
	payload: Payload;
}

export interface SimpleKeyedAction {
	type: string;
	keyChain: Array<string>;
}

export interface ActionGenerator<Payload = null> {
	(payload?: Payload): Action<Payload>;
}

export interface SimpleKeyedActionGenerator {
	(): SimpleKeyedAction;
}

export interface KeyedActionGenerator<Payload> {
	(payload: Payload): KeyedAction<Payload>;
}

export interface ActionMap<ReducerStructure> {
	[key: string]: (draft: Draft<ReducerStructure>, payload?: any) => void;
}

export interface Slice<ReducerStructure> {
	initialState: ReducerStructure;
	key: string;
	keyChain: Array<string>;
	reduce(state: ReducerStructure, action: AnyAction): void;
	createAction<Payload>(
		actionName: string,
		callback: (draft: Draft<ReducerStructure>, payload: Payload) => void
	): KeyedActionGenerator<Payload>;
	createSimpleAction(actionName: string, callback: (draft: Draft<ReducerStructure>) => void): SimpleKeyedActionGenerator;
	addAction<Payload>(actionName: string, callback: (draft: Draft<ReducerStructure>, payload?: Payload) => void): ActionGenerator<Payload>;
	addSlice(slice: Slice<unknown>): Slice<ReducerStructure>;
	selectState(): ParametricSelector<any, unknown, unknown> | undefined;
	resolveSlice(keyChain: Array<string>): void;
	handleSaga(): IterableIterator<any>;
	createSideEffect<Payload>(actionName: string, callback: () => Generator<any, void, unknown>): ActionGenerator<Payload>;
	addUnmanagedReducer(key: string, reducer: Reducer): Slice<ReducerStructure>;
}

export interface SliceManagerInterface {
	combinedReducer: Reducer;
	reducers: ReducersMapObject;
	slices: Slice<any>[];
	reduce(state: any, action: AnyAction): void;
	addSlice(slice: Slice<any>): void;
	rootSaga(): IterableIterator<any>;
}

export interface StoreAbstraction {
	sliceManager: SliceManagerInterface;
	reduxSaga: unknown;
	unappliedMiddleware: Array<unknown>;
	middleware: StoreEnhancer;
	getStore(): Store;
	addSlice(slice: Slice<any>): StoreAbstraction;
	lockSideEffects(): StoreAbstraction;
}
