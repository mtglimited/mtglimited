import { combineReducers } from 'redux';
import { firebaseStateReducer as firebase } from 'react-redux-firebase';
import { routerReducer as routing } from 'react-router-redux';

import configureStore from './CreateStore';
import drawer from './DrawerRedux';

export default () => configureStore(
  combineReducers({
    firebase,
    routing,
    drawer,
  }),
);
