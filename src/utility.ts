export function developmentKeyChainCompare(keys1: Array<string>, keys2: Array<string>): Boolean {
	if (keys1.length === keys2.length) {
		for (let i in keys1) {
			if (keys1[i] !== keys2[i]) {
				return false;
			}
		}
		return true;
	}
	return false;
}

// In production we only compare the references, this way actions can still be fired manually
export function productionKeyChainCompare(keys1: Array<string> = [], keys2: Array<string> = []): Boolean {
	return keys1?.length > 0 && keys1 === keys2;
}

export function keyChainCompare(keys1: Array<string> = [], keys2: Array<string> = []): Boolean {
	if (process.env.NODE_ENV !== 'production') {
		return developmentKeyChainCompare(keys1, keys2);
	} else {
		return productionKeyChainCompare(keys1, keys2);
	}
}

export function accessNestedObject(nestedObject: any, keyChain: Array<string>): any {
	return keyChain.reduce((obj: any, key: string) => (obj && obj[key] !== 'undefined' ? obj[key] : undefined), nestedObject);
}
