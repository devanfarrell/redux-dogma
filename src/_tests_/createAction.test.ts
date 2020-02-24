import { createAction } from '../createAction';

var string = 'STRING';
type PayloadTest = { name: string };
var payload: PayloadTest = { name: 'Jack' };

describe('Create Action', () => {
  it('is called without crashing', () => {
    const [STRING, actionGenerator] = createAction<PayloadTest>(string);
    expect(STRING).toBe(STRING);
    const actionGeneratorResult = actionGenerator({ name: 'Jack' });
    expect(actionGeneratorResult.type).toBe(string);
    expect(actionGeneratorResult.payload).toStrictEqual(payload);
  });
});
