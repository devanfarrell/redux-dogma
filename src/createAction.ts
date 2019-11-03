import { AnyAction } from 'redux';
import { ActionGenerator } from './types';

export function createAction(type: string): [string, ActionGenerator] {
  return [
    type,
    (payload: any): AnyAction => ({
      type,
      payload,
    }),
  ];
}
