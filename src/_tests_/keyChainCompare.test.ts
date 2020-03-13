import { keyChainCompare, developmentKeyChainCompare, productionKeyChainCompare } from '../utility';

describe('Key chain comparisons', () => {
	it('Development Level Test', () => {
		expect(developmentKeyChainCompare([], ['test'])).toBe(false);
		expect(developmentKeyChainCompare(['test'], ['test'])).toBe(true);
		expect(developmentKeyChainCompare(['test'], ['test', 'test'])).toBe(false);
		expect(developmentKeyChainCompare(['test', 'test'], ['test'])).toBe(false);
		expect(developmentKeyChainCompare(['test', 'test'], ['test', 'test'])).toBe(true);
		expect(developmentKeyChainCompare(['bob', 'test'], ['test', 'test'])).toBe(false);
	});
	it('Production Level Test', () => {
		const arr = ['thing'];
		const arr2 = ['thing', 'test'];
		const arr3: string[] = [];
		expect(productionKeyChainCompare([], ['test'])).toBe(false);
		expect(productionKeyChainCompare(undefined, ['test'])).toBe(false);
		expect(productionKeyChainCompare(undefined, undefined)).toBe(false);
		expect(productionKeyChainCompare(['test'], ['test'])).toBe(false);
		expect(productionKeyChainCompare(['test'], ['test', 'test'])).toBe(false);
		expect(productionKeyChainCompare(['test', 'test'], ['test'])).toBe(false);
		expect(productionKeyChainCompare(['test', 'test'], ['test', 'test'])).toBe(false);
		expect(productionKeyChainCompare(arr, arr)).toBe(true);
		expect(productionKeyChainCompare(arr2, arr2)).toBe(true);
		expect(productionKeyChainCompare(arr3, arr3)).toBe(false);
	});

	it('Development abstract test', () => {
		const arr = ['thing'];
		const arr2 = ['thing', 'test'];
		const arr3: string[] = [];
		expect(keyChainCompare([], ['test'])).toBe(false);
		expect(keyChainCompare(['test'], ['test'])).toBe(true);
		expect(keyChainCompare(['test'], ['test', 'test'])).toBe(false);
		expect(keyChainCompare(['test', 'test'], ['test'])).toBe(false);
		expect(keyChainCompare(['test', 'test'], ['test', 'test'])).toBe(true);
		expect(keyChainCompare(arr, arr)).toBe(true);
		expect(keyChainCompare(arr2, arr2)).toBe(true);
		expect(keyChainCompare(arr3, arr3)).toBe(false);
	});
	it('Production abstract test', () => {
		const arr = ['thing'];
		const arr2 = ['thing', 'test'];
		const arr3: string[] = [];
		process.env.NODE_ENV = 'production';
		expect(keyChainCompare([], ['test'])).toBe(false);
		expect(keyChainCompare(['test'], ['test'])).toBe(false);
		expect(keyChainCompare(['test'], ['test', 'test'])).toBe(false);
		expect(keyChainCompare(['test', 'test'], ['test'])).toBe(false);
		expect(keyChainCompare(['test', 'test'], ['test', 'test'])).toBe(false);
		expect(keyChainCompare(arr, arr)).toBe(true);
		expect(keyChainCompare(arr2, arr2)).toBe(true);
		expect(keyChainCompare(arr3, arr3)).toBe(false);
	});
});
