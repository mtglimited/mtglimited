import { fromJS } from 'immutable';

export const Types = {
  GET_ROOMS: 'sharpspring/lobby/GET_ROOMS',
};

export const INITIAL_STATE = fromJS({
  rooms: [],
  fetching: false,
});

export default (state = INITIAL_STATE, action = {}) => {
  switch (action.type) {
    default:
      return state;
  }
};
