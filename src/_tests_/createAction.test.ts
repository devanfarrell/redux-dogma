import { createAction } from '../createAction';

var string = 'STRING';
var payload = { name: 'Jack' };

describe('Create Action', () => {
  it('is called without crashing', () => {
    const [STRING, actionGenerator] = createAction(string);
    expect(STRING).toBe(STRING);
    const actionGeneratorResult = actionGenerator(payload);
    expect(actionGeneratorResult.type).toBe(string);
    expect(actionGeneratorResult.payload).toBe(payload);
  });
});
