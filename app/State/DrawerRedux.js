import { fromJS } from 'immutable';

const Types = {
  OPEN: 'mtglimited/drawer/OPEN',
  CLOSE: 'mtglimited/drawer/CLOSE',
  SET_CONTENT: 'mtglimited/drawer/SET_CONTENT',
  SET_PROPS: 'mtglimited/drawer/SET_PROPS',
};

export const open = () => ({
  type: Types.OPEN,
});

export const close = () => ({
  type: Types.CLOSE,
});

export const setContent = content => ({
  type: Types.SET_CONTENT,
  content,
});

export const setProps = props => ({
  type: Types.SET_PROPS,
  props,
});

export const INITIAL_STATE = fromJS({
  isOpen: false,
  content: '',
  props: {},
});

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Types.OPEN:
      return state.set('isOpen', true);
    case Types.CLOSE:
      return state.set('isOpen', false);
    case Types.SET_CONTENT:
      return state.set('content', action.content);
    case Types.SET_PROPS:
      return state.set('props', action.props);
    default:
      return state;
  }
};

