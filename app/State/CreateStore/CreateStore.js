import { createStore, applyMiddleware, compose } from 'redux';
import { reactReduxFirebase } from 'react-redux-firebase';
import * as firebase from 'firebase';
import thunk from 'redux-thunk';
import DevTools from 'Containers/DevTools';
import firebaseConfig from './firebaseConfig';

firebase.initializeApp(firebaseConfig);

const config = {
  userProfile: 'users',
  updateProfileOnLogin: true,
};

export default (rootReducer) => {
  const middleware = [
    thunk.withExtraArgument(firebase),
  ];
  const enhancers = [
    reactReduxFirebase(firebase, config),
  ];

  enhancers.push(applyMiddleware(...middleware));
  if (process.env.NODE_ENV === 'development') {
    enhancers.push(DevTools.instrument());
  }

  return createStore(rootReducer, compose(...enhancers));
};
