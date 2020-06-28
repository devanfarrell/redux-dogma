import { createAction } from '../createAction';

var string = 'STRING';
type PayloadTest = { name: string };
var payload: PayloadTest = { name: 'Jack' };

describe('No slice action creation', () => {
	it('createAction', () => {
		const actionGenerator = createAction<PayloadTest>(string);
		const actionGeneratorResult = actionGenerator({ name: 'Jack' });
		expect(actionGeneratorResult.type).toBe(string);
		expect(actionGeneratorResult.payload).toStrictEqual(payload);
	});
});
