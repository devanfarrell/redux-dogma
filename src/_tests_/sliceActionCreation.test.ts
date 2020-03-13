import { createStoreAbstraction } from '../storeAbstraction';
import { createSlice } from '../slice';

const slice1 = createSlice('slice1');

const slice2_1 = createSlice('slice2_1');
const slice2 = createSlice('slice2').addSlice(slice2_1);

createStoreAbstraction()
	.addSlice(slice1)
	.addSlice(slice2)
	.lockSideEffects()
	.getStore();

var testString = 'STRING';
type PayloadTest = { name: string };

describe('Test creation of all slice actions', () => {
	const actionTest1 = slice1.createAction<PayloadTest>(testString, () => {});
	const actionTest2 = slice2_1.createSideEffect<PayloadTest>(testString, function*() {});
	const actionTest2_1 = slice2_1.createAction<PayloadTest>(testString, () => {});

	it('slice.createAction', () => {
		expect(actionTest1({ name: 'testy test' })).toEqual({ type: testString, keyChain: ['slice1'], payload: { name: 'testy test' } });
		expect(actionTest2({ name: 'testy test' })).toEqual({ type: `slice2/slice2_1/${testString}`, payload: { name: 'testy test' } });
		expect(actionTest2_1({ name: 'testy test' })).toEqual({
			type: testString,
			keyChain: ['slice2', 'slice2_1'],
			payload: { name: 'testy test' },
		});
	});
});
