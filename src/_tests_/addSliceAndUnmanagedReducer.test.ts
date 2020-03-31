import { createStoreAbstraction } from '../storeAbstraction';
import { createSlice } from '../slice';
import { Reducer } from 'redux';

const unmannagedReducer: Reducer = () => {
	return {};
};
const slice = createSlice('slice');
const topSlice = createSlice('topSlice');
const brokenSlice = createSlice('brokenSlice');
const brokenSliceChild = createSlice('brokenSliceChild');

describe('Test creation of all slice actions', () => {
	it('There is a broken slice that should throw', () => {
		expect(() => {
			brokenSlice.addSlice(brokenSliceChild);
			brokenSlice.createAction('oops', () => {});
			createStoreAbstraction().addSlice(brokenSlice).lockSideEffects().getStore();
		}).toThrow();
	});
	it('Slices are added without', () => {
		expect(() => {
			topSlice.addSlice(slice).addUnmanagedReducer('reducer', unmannagedReducer);
			createStoreAbstraction().addSlice(topSlice).lockSideEffects().getStore();
		}).not.toThrow();
	});
	it('Reducers are all in slice', () => {
		const reducerKeys = Object.keys(topSlice.reducers);
		expect(reducerKeys).toEqual(['reducer', 'slice']);
	});

	it('Slice keys match', () => {
		expect(topSlice.keyChain).toEqual(['topSlice']);
		expect(slice.keyChain).toEqual(['topSlice', 'slice']);
	});

	it('Add a slice after the rest of the store is instantiated', () => {
		const codeSplitSlice = createSlice('codeSplitSlice');
		topSlice.addSlice(codeSplitSlice);
	});
});
