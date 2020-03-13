import { createStore, Store, applyMiddleware, StoreEnhancer } from 'redux';
import { Slice, SliceManagerInterface, StoreAbstraction } from './types';

import { composeWithDevTools } from 'redux-devtools-extension';
import SliceManager from './sliceManager';
import ReduxSaga, { SagaMiddleware } from 'redux-saga';

class storeAbstraction implements StoreAbstraction {
	sliceManager: SliceManagerInterface;
	store: Store | null;
	reduxSaga: SagaMiddleware;
	unappliedMiddleware: Array<any>;
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

	addUnmanagedRootSaga(saga: Function) {
		this.unmanagedRootSaga = saga;
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
	return new storeAbstraction();
}
