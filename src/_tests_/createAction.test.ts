import { createAction } from '../createAction';

var string = 'STRING';
var payload = { name: 'Jack' };

describe('Create Action', () => {
  it('is called without crashing', () => {
    const [STRING, actionGenerator] = createAction<{ name: string }>(string);
    expect(STRING).toBe(STRING);
    const actionGeneratorResult = actionGenerator({ name: 'Jack' });
    expect(actionGeneratorResult.type).toBe(string);
    expect(actionGeneratorResult.payload).toStrictEqual(payload);
  });
});
