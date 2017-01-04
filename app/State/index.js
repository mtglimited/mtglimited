import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import configureStore from './CreateStore';

export default () => {
  const rootReducer = combineReducers({
    routing,
    sets: require('./SetsRedux').reducer,
  });

  return configureStore(rootReducer);
};
