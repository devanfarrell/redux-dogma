import { Action, SimpleAction } from './types';

export function createAction(type: string): () => SimpleAction;
export function createAction<Payload>(type: string): (payload: Payload) => Action<Payload>;

export function createAction(type: string) {
	return (payload?: any) => ({ type, payload });
}
