import produce, { Draft } from 'immer';
import { AnyAction, combineReducers, Reducer, ReducersMapObject, Store } from 'redux';
import { ForkEffect, takeEvery, takeLatest } from 'redux-saga/effects';
import { accessNestedObject, keyChainCompare } from './utility';

interface SimpleKeyedAction {
	type: string;
	keyChain: string[];
}

interface SimpleKeyedActionGenerator {
	(): SimpleKeyedAction;
}

interface KeyedAction<Payload> {
	type: string;
	keyChain: string[];
	payload: Payload;
}

interface KeyedActionGenerator<Payload> {
	(payload: Payload): KeyedAction<Payload>;
}

// deprecate
interface Action<Payload> {
	type: string;
	payload?: Payload;
}

// deprecate
interface ActionGenerator<Payload = null> {
	(payload?: Payload): Action<Payload>;
}

interface ActionMap<ReducerStructure> {
	[key: string]: (draft: Draft<ReducerStructure>, payload: any) => void;
}

export class Slice<ReducerStructure> {
	key: string;
	actionHandlers: ActionMap<ReducerStructure>;
	keyScopedActionHandlers: ActionMap<ReducerStructure>;
	sagaActionHandlers: ForkEffect[];
	initialState: any;
	keyChain: string[];
	combinedReducer: Reducer;
	reducers: ReducersMapObject;
	unmanagedReducers: ReducersMapObject;
	slices: Slice<any>[];
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
		// @ts-ignore
		this.reduce = this.reduce.bind(this);
		this.slices = [];
		this.unmanagedReducers = {};
		this.resolved = false;
		this.hasActions = false;
	}

	public createAction<Payload>(
		actionName: string,
		callback: (draft: Draft<ReducerStructure>, payload: Payload) => void
	): KeyedActionGenerator<Payload> {
		this.hasActions = true;
		this.keyScopedActionHandlers[actionName] = callback;

		return (payload: Payload): KeyedAction<Payload> => ({
			type: actionName,
			keyChain: this.keyChain,
			payload,
		});
	}

	public createSimpleAction(actionName: string, callback: (draft: Draft<ReducerStructure>) => void): SimpleKeyedActionGenerator {
		this.hasActions = true;
		this.keyScopedActionHandlers[actionName] = callback;
		return (): SimpleKeyedAction => ({
			type: actionName,
			keyChain: this.keyChain,
		});
	}

	// public addAction<Payload = unknown>(actionGenerator: (payload: Payload) => Action<Payload>, callback: (draft: Draft<ReducerStructure>, (payload: Payload) => void)) {
	// 		this.hasActions = true;
	// 		// @ts-ignore
	// 		const { type } = actionGenerator();
	// 		this.actionHandlers[type] = callback;
	// 	};
	// }

	public addAction<Payload = unknown>(
		actionGenerator: (payload: Payload) => Action<Payload>,
		callback: (draft: Draft<ReducerStructure>, payload: Payload) => void
	) {
		this.hasActions = true;
		// @ts-ignore
		const { type } = actionGenerator();
		this.actionHandlers[type] = callback;
	}

	public selectState() {
		return (state: Store): ReducerStructure => accessNestedObject(state, this.keyChain);
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

	public resolveSlice(keyChain: string[]) {
		// Create the keychain
		this.keyChain = [...keyChain, this.key];
		this.resolved = true;
		if (this.hasActions && this.slices.length > 0) {
			throw new Error(`ERROR: ${this.key} has both actions and sub slices.
      You must move the actions to another sub slice
      Slice path: ${this.keyChain}`);
		}
		// recursively resolve sub-slices
		this.slices.forEach((slice) => {
			slice.resolveSlice(this.keyChain);
			this.reducers[slice.key] = slice.reduce;
			this.combinedReducer = combineReducers(this.reducers);
		});
	}

	public addUnmanagedReducer(key: string, reducer: Reducer): Slice<ReducerStructure> {
		this.unmanagedReducers[key] = reducer;
		this.reducers[key] = reducer;
		this.combinedReducer = combineReducers(this.reducers);
		return this;
	}

	public *handleSaga(): IterableIterator<any> {
		for (let slice of this.slices) {
			yield* slice.handleSaga();
		}
		for (let handler of this.sagaActionHandlers) {
			yield handler;
		}
	}

	private addEffect<Payload>(
		takePattern: (type: string, callback: (action: KeyedAction<Payload>) => any) => ForkEffect<Payload>,
		type: string,
		callback: (action: KeyedAction<Payload>) => Generator<any>
	): ActionGenerator<Payload> {
		this.hasActions = true;
		this.sagaActionHandlers.push(takePattern(type, callback));
		return (payload?: Payload): Action<Payload> => ({
			type,
			payload,
		});
	}

	public addSideEffect<Payload>(actionName: string, callback: (action: KeyedAction<Payload>) => Generator<any>): ActionGenerator<Payload> {
		return this.addEffect(takeEvery, actionName, callback);
	}

	public createSideEffect<Payload>(actionName: string, callback: (action: KeyedAction<Payload>) => Generator): ActionGenerator<Payload> {
		const type = [...this.keyChain, actionName].join('/');
		return this.addSideEffect(type, callback);
	}

	public addDebouncedSideEffect<Payload>(
		actionName: string,
		callback: (action: KeyedAction<Payload>) => Generator<any>
	): ActionGenerator<Payload> {
		this.hasActions = true;
		this.sagaActionHandlers.push(takeLatest(actionName, callback));

		return (payload?: Payload): Action<Payload> => ({
			type: actionName,
			payload,
		});
	}

	public createDebouncedSideEffect<Payload>(actionName: string, callback: GeneratorFunction): ActionGenerator<Payload> {
		const type = [...this.keyChain, actionName].join('/');
		return this.addDebouncedSideEffect(type, callback);
	}
}

export function createSlice<Structure>(key: string, initialState?: Structure) {
	return new Slice<Structure>(key, initialState);
}
