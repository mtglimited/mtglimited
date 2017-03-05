import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import configureStore from './CreateStore';
import { reducer as sets } from './SetsRedux';

export default () => configureStore(
  combineReducers({
    routing,
    sets,
  }),
);
