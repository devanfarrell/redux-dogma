import { createStoreAbstraction, StoreAbstraction } from '../storeAbstraction';
import { createSlice } from '../slice';
import { Reducer } from 'redux';
describe('Store abstraction tests', () => {
	it('Creates store abstraction', () => {
		expect(createStoreAbstraction()).toBeDefined();
		const abstraction = createStoreAbstraction();
		const slice = createSlice('slice');
		const unmanagedReducer: Reducer = () => {
			return {};
		};

		expect(() => {
			abstraction.addSlice(slice).addUnmanagedReducer('reducer', unmanagedReducer).lockSideEffects().getStore();
		}).not.toThrow();

		expect(abstraction).toBeInstanceOf(StoreAbstraction);
		const keys = Object.keys(abstraction.sliceManager.reducers);
		expect(keys).toStrictEqual(['slice', 'reducer']);
	});
});
