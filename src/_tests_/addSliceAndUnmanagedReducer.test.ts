import { createStoreAbstraction } from '../storeAbstraction';
import { createSlice } from '../slice';
import { Reducer } from 'redux';

const unmannagedReducer: Reducer = () => {
	return {};
};
const slice = createSlice('slice');

const topSlice = createSlice('topSlice');

topSlice.addSlice(slice).addUnmanagedReducer('reducer', unmannagedReducer);

createStoreAbstraction()
	.addSlice(topSlice)
	.lockSideEffects()
	.getStore();

describe('Test creation of all slice actions', () => {
	it('Reducers are all in slice', () => {
		const reducerKeys = Object.keys(topSlice.reducers);
		expect(reducerKeys).toEqual(['reducer', 'slice']);
	});

	it('Slice keys match', () => {
		expect(topSlice.keyChain).toEqual(['topSlice']);
		expect(slice.keyChain).toEqual(['topSlice', 'slice']);
	});
});
