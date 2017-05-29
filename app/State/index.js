import { combineReducers } from 'redux';
import { firebaseStateReducer as firebase } from 'react-redux-firebase';
import { routerReducer as routing } from 'react-router-redux';

import configureStore from './CreateStore';
import { reducer as sets } from './SetsRedux';
import { reducer as drawer } from './DrawerRedux';
import lobby from './LobbyRedux';

export default () => configureStore(
  combineReducers({
    firebase,
    routing,
    sets,
    drawer,
    lobby,
  }),
);
