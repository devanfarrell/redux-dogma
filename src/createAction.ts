import { ActionGenerator, Action } from './types';

export function createAction<Payload>(type: string): [string, ActionGenerator<Payload>] {
  return [
    type,
    (payload?: Payload): Action<Payload> => ({
      type,
      payload,
    }),
  ];
}
