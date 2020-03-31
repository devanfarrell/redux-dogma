import { createStoreAbstraction, storeAbstraction } from '../storeAbstraction';
import { createSlice } from '../slice';
import { Reducer } from 'redux';
describe('Store abstraction tests', () => {
	it('Creates store abstraction', () => {
		expect(createStoreAbstraction()).toBeDefined();
		const abstraction = createStoreAbstraction();
		const slice = createSlice('slice');
		const unmannagedReducer: Reducer = () => {
			return {};
		};

		expect(() => {
			abstraction.addSlice(slice).addUnmanagedReducer('reducer', unmannagedReducer).lockSideEffects().getStore();
		}).not.toThrow();

		expect(abstraction).toBeInstanceOf(storeAbstraction);
		const keys = Object.keys(abstraction.sliceManager.reducers);
		expect(keys).toStrictEqual(['slice', 'reducer']);
	});
	process.env.NODE_ENV = 'production';
	it('Create Production Abstraction', () => {
		expect(createStoreAbstraction()).toBeDefined();
		const abstraction = createStoreAbstraction();
		const slice = createSlice('slice');
		const unmannagedReducer: Reducer = () => {
			return {};
		};

		expect(() => {
			abstraction.addSlice(slice).addUnmanagedReducer('reducer', unmannagedReducer).lockSideEffects().getStore();
		}).not.toThrow();

		expect(abstraction).toBeInstanceOf(storeAbstraction);
		const keys = Object.keys(abstraction.sliceManager.reducers);
		expect(keys).toStrictEqual(['slice', 'reducer']);
	});
});
