import { keyChainCompare, developmentKeyChainCompare, productionKeyChainCompare } from '../utility';

describe('AccessNestedObject', () => {
	it('Top Level Test', () => {
		expect(keyChainCompare([], ['test'])).toBe(false);
		expect(keyChainCompare(undefined, ['test'])).toBe(false);
		expect(keyChainCompare(['test'], ['test'])).toBe(true);
		expect(keyChainCompare(['test'], ['test', 'test'])).toBe(false);
		expect(keyChainCompare(['test', 'test'])).toBe(false);
		expect(keyChainCompare(['test', 'test'], ['test'])).toBe(false);
		expect(keyChainCompare(['test', 'test'], ['test', 'test'])).toBe(true);
	});
	it('Development Level Test', () => {
		expect(developmentKeyChainCompare([], ['test'])).toBe(false);
		expect(developmentKeyChainCompare(['test'], ['test'])).toBe(true);
		expect(developmentKeyChainCompare(['test'], ['test', 'test'])).toBe(false);
		expect(developmentKeyChainCompare(['test', 'test'], ['test'])).toBe(false);
		expect(developmentKeyChainCompare(['test', 'test'], ['test', 'test'])).toBe(true);
	});
	it('Production Level Test', () => {
		const arr = ['thing'];
		const arr2 = ['thing', 'test'];
		expect(productionKeyChainCompare([], ['test'])).toBe(false);
		expect(productionKeyChainCompare(['test'], ['test'])).toBe(false);
		expect(productionKeyChainCompare(['test'], ['test', 'test'])).toBe(false);
		expect(productionKeyChainCompare(['test', 'test'], ['test'])).toBe(false);
		expect(productionKeyChainCompare(['test', 'test'], ['test', 'test'])).toBe(false);
		expect(productionKeyChainCompare(arr, arr)).toBe(true);
		expect(productionKeyChainCompare(arr2, arr2)).toBe(true);
	});
});
