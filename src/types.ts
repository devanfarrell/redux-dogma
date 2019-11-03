import { AnyAction } from 'redux';

export interface KeyedAction extends AnyAction {
  keyChain: Array<string>;
}

export interface ActionGenerator {
  (payload?: any): AnyAction | KeyedAction;
}
