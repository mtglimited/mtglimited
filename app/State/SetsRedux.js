import { createReducer, createActions } from 'reduxsauce';
// import fetch from 'isomorphic-fetch';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getSetsRequest: [],
  getSetsSuccess: ['sets'],
  getSetsFailure: ['error'],
});

export const SetTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = {
  data: [],
  error: null,
  fetching: false,
};

/* ------------- Reducers ------------- */

export const request = (state: Object) => ({
  ...state,
  fetching: true,
});

export const success = (state: Object, { data }: Array) => ({
  ...state,
  fetching: false,
  error: null,
  data,
});

export const failure = (state: Object, { error }: Object) => ({
  ...state,
  fetching: false,
  error,
  data: [],
});

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_SETS_REQUEST]: request,
  [Types.GET_SETS_SUCCESS]: success,
  [Types.GET_SETS_FAILURE]: failure,
});
