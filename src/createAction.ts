import { AnyAction } from 'redux';
import { ActionGenerator } from './types';

export function createAction<Payload>(type: string): [string, ActionGenerator<Payload>] {
  return [
    type,
    (payload: any): AnyAction => ({
      type,
      payload,
    }),
  ];
}
