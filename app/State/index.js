import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import configureStore from './CreateStore';

/* eslint-disable global-require */
export default () => {
  const rootReducer = combineReducers({
    routing,
    sets: require('./SetsRedux').reducer,
    draft: require('./DraftRedux').reducer,
  });

  return configureStore(rootReducer);
};
