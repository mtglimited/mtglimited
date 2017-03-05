import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import configureStore from './CreateStore';
import { reducer as sets } from './SetsRedux';
import { reducer as drawer } from './DrawerRedux';

export default () => configureStore(
  combineReducers({
    routing,
    sets,
    drawer,
  }),
);
