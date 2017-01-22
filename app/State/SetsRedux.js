import { createReducer, createActions } from 'reduxsauce';
import axios from 'axios';
import { List, Map } from 'immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getSetsRequest: [],
  getSetsSuccess: ['availableSets'],
  getSetRequest: ['set'],
  getSetSuccess: ['data'],
});

export const SetTypes = Types;
export default Creators;

export const fetchSets = () => (dispatch) => {
  dispatch(Creators.getSetsRequest());
  return axios('/assets/sets/active-sets.json')
    .then(json => dispatch(Creators.getSetsSuccess(json.data.sets)));
};

export const fetchSet = set => (dispatch) => {
  dispatch(Creators.getSetRequest(set));
  return axios(`/assets/sets/${set}.json`)
    .then(json => dispatch(Creators.getSetSuccess(json.data)));
};

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Map({
  availableSets: List.of([]),
  error: null,
  fetching: false,
});

/* ------------- Reducers ------------- */

export const setsRequest = state => state.merge({
  ...state,
  fetching: true,
});

export const setsSuccess = (state: Object, { availableSets }: Array) => state.merge({
  ...state,
  fetching: false,
  error: null,
  availableSets,
});

export const setRequest = (state: Object, data: Object) => state.merge({
  ...state,
  [data.set]: {
    fetching: true,
  },
});

export const setSuccess = (state: Object, { data }: Object) => state.merge({
  ...state,
  fetching: false,
  error: null,
  [data.code]: {
    ...data,
    fetching: false,
  },
});

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_SETS_REQUEST]: setsRequest,
  [Types.GET_SETS_SUCCESS]: setsSuccess,
  [Types.GET_SET_REQUEST]: setRequest,
  [Types.GET_SET_SUCCESS]: setSuccess,
});
