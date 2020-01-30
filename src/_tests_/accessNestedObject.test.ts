import { accessNestedObject } from '../utility';

var obj = { top: { middle: { bottom: [3, 2, 1, 0] } } };

describe('CaccessNestedObject', () => {
  it('Access nested objects', () => {
    expect(accessNestedObject(obj, ['top'])).toStrictEqual({ middle: { bottom: [3, 2, 1, 0] } });
    expect(accessNestedObject(obj, ['top', 'middle'])).toStrictEqual({ bottom: [3, 2, 1, 0] });
    expect(accessNestedObject(obj, ['top', 'middle', 'bottom'])).toStrictEqual([3, 2, 1, 0]);
  });
});
