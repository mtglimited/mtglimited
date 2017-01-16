import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import DevTools from 'Containers/DevTools';

export default (rootReducer) => {
  const middleware = [thunkMiddleware];
  const enhancers = [];

  enhancers.push(applyMiddleware(...middleware));

  if (process.env.NODE_ENV === 'development') {
    enhancers.push(DevTools.instrument());
  }

  return createStore(rootReducer, compose(...enhancers));
};
