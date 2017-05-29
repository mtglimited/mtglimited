import { createStore, applyMiddleware, compose } from 'redux';
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase';
import thunk from 'redux-thunk';
import DevTools from 'Containers/DevTools';
import firebaseConfig from './firebaseConfig';

const config = {
  userProfile: 'users',
  updateProfileOnLogin: true,
};

export default (rootReducer) => {
  const middleware = [
    thunk.withExtraArgument(getFirebase),
  ];
  const enhancers = [
    reactReduxFirebase(firebaseConfig, config),
  ];

  enhancers.push(applyMiddleware(...middleware));
  if (process.env.NODE_ENV === 'development') {
    enhancers.push(DevTools.instrument());
  }

  return createStore(rootReducer, compose(...enhancers));
};
