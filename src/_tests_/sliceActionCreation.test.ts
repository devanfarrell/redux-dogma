import { createStoreAbstraction } from '../storeAbstraction';
import { createSlice } from '../slice';
import { createAction } from '../createAction';

const slice1 = createSlice<{ name?: string }>('slice1', {});

const slice2_1 = createSlice('slice2_1', {});
const slice2 = createSlice('slice2').addSlice(slice2_1);

createStoreAbstraction().addSlice(slice1).addSlice(slice2).lockSideEffects().getStore();

var testString = 'STRING';
type PayloadTest = { name: string };

describe('Test creation of all slice actions', () => {
	const actionTest1 = slice1.createAction(testString, (draft) => {
		console.debug(draft);
	});

	const actionTest2 = slice1.createAction<PayloadTest>(testString, (draft, payload) => {
		console.debug(draft, payload);
	});
	const actionTest2_1 = slice2_1.createAction<PayloadTest>(testString, () => {});

	const debouncedActionTest = slice2_1.createDebouncedSideEffect<PayloadTest>('debounced', function* (thing) {
		console.debug(thing);
		yield () => {};
	});

	const action = createAction<PayloadTest>('hello');
	slice1.addAction(action, (draft, payload) => {
		draft.name = payload.name;
	});

	it('slice.createAction', () => {
		expect(actionTest1()).toEqual({ type: testString, keyChain: ['slice1'], payload: undefined });
		expect(actionTest2({ name: 'testy test' })).toEqual({ type: testString, keyChain: ['slice1'], payload: { name: 'testy test' } });
		expect(debouncedActionTest({ name: 'testy test' })).toEqual({ type: `slice2/slice2_1/debounced`, payload: { name: 'testy test' } });
		expect(actionTest2_1({ name: 'testy test' })).toEqual({
			type: testString,
			keyChain: ['slice2', 'slice2_1'],
			payload: { name: 'testy test' },
		});
	});
});
