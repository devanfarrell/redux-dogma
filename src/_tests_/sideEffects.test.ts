import { createStoreAbstraction } from '../storeAbstraction';

function* rootSaga() {}

describe('Side effects testing', () => {
	it('Add unmanaged side effect', () => {
		createStoreAbstraction().addUnmanagedRootSaga(rootSaga).lockSideEffects().getStore();
	});
});
