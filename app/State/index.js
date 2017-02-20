import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import configureStore from './CreateStore';

export default () => {
  /* eslint-disable global-require */
  const rootReducer = combineReducers({
    routing,
    sets: require('./SetsRedux').reducer,
    players: require('./PlayersRedux').reducer,
    draft: require('./DraftRedux').reducer,
  });

  return configureStore(rootReducer);
};
