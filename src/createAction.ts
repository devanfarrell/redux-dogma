export function createAction<Payload>(type: string) {
	return (payload: Payload) => ({ type, payload });
}

export function createSimpleAction(type: string) {
	return () => ({ type });
}
