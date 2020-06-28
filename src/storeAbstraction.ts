import { applyMiddleware, createStore, Reducer, Store, StoreEnhancer } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import ReduxSaga, { SagaMiddleware } from 'redux-saga';
import { Slice } from './slice';
import SliceManager from './sliceManager';

export class StoreAbstraction {
	sliceManager: SliceManager;
	store: Store | null;
	reduxSaga: SagaMiddleware;
	unappliedMiddleware: any[];
	middleware: StoreEnhancer;
	unmanagedRootSaga: Function | null;

	constructor() {
		const isProduction: boolean = process.env.NODE_ENV === 'production';
		this.store = null;
		this.sliceManager = new SliceManager();
		this.reduxSaga = ReduxSaga();
		this.unappliedMiddleware = [this.reduxSaga];
		this.unmanagedRootSaga = null;
		if (isProduction) {
			this.middleware = applyMiddleware(...this.unappliedMiddleware);
		} else {
			const composeEnhancers = composeWithDevTools({
				/*OPTIONS*/
			});
			this.middleware = composeEnhancers(applyMiddleware(...this.unappliedMiddleware));
		}
	}

	getStore(): Store {
		if (!this.store) {
			this.store = createStore(this.sliceManager.reduce, this.middleware);
		}
		return this.store;
	}

	addSlice(slice: Slice<any>): StoreAbstraction {
		slice.keyChain = [slice.key];
		this.sliceManager.addSlice(slice);
		return this;
	}

	addUnmanagedReducer(key: string, reducer: Reducer): StoreAbstraction {
		this.sliceManager.reducers[key] = reducer;
		return this;
	}

	addUnmanagedRootSaga(saga: Function): StoreAbstraction {
		this.unmanagedRootSaga = saga;
		return this;
	}

	lockSideEffects() {
		if (!this.store) {
			this.store = createStore(this.sliceManager.reduce, this.middleware);
		}
		const abstractionContext = this;
		function* combinedSaga() {
			if (abstractionContext.unmanagedRootSaga) {
				yield* abstractionContext.unmanagedRootSaga();
			}
			yield* abstractionContext.sliceManager.rootSaga();
		}
		this.reduxSaga.run(combinedSaga);
		return this;
	}
}

export function createStoreAbstraction() {
	return new StoreAbstraction();
}
