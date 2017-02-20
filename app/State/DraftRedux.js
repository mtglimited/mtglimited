import { createReducer, createActions } from 'reduxsauce';
import { Map } from 'immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setPassDirection: [],
});

export const SetTypes = Types;
export default Creators;

export const PASS_DIRECTIONS = {
  LEFT: -1,
  RIGHT: 1,
};

export const INITIAL_STATE = Map({
  passDirection: PASS_DIRECTIONS.LEFT,
});

export const setPassDirection = (state: Object, { passDirection }: String) => state.merge({
  passDirection,
});

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_PASS_DIRECTION]: setPassDirection,
});
