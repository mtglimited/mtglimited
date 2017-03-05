import { createReducer, createActions } from 'reduxsauce';
import { fromJS } from 'immutable';

const { Types, Creators } = createActions({
  setIsOpen: ['isOpen'],
  setContent: ['content'],
  setProps: ['props'],
});

export const SetTypes = Types;
export default Creators;

export const INITIAL_STATE = fromJS({
  isOpen: false,
  content: '',
  props: {},
});

const setIsOpen = (state, { isOpen }) => state.set('isOpen', isOpen);

const setContent = (state, { content }) => state.set('content', content);

const setProps = (state, { props }) => state.set('props', props);

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_IS_OPEN]: setIsOpen,
  [Types.SET_CONTENT]: setContent,
  [Types.SET_PROPS]: setProps,
});
