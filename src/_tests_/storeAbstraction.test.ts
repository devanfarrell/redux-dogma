import { createStoreAbstraction, storeAbstraction } from '../storeAbstraction';
describe('Store abstraction tests', () => {
	it('Creates store abstraction', () => {
		expect(createStoreAbstraction()).toBeDefined();
		const abstraction = createStoreAbstraction();
		expect(abstraction).toBeInstanceOf(storeAbstraction);
        
	});
});
