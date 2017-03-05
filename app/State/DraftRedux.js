import { createReducer, createActions } from 'reduxsauce';
import { fromJS } from 'immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  connect: [],
  pickCard: ['cardIndex'],
});

export const SetTypes = Types;
export default Creators;

export const INITIAL_STATE = fromJS({
  client: {},
});

export const connect = state => state;

export const pickCard = state => state;

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CONNECT]: connect,
  [Types.PICK_CARD]: pickCard,
});
