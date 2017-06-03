import React from 'react';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import routes from 'routes';
import DevTools from 'Containers/DevTools';
import createStore from 'State';

const store = createStore();
const history = syncHistoryWithStore(browserHistory, store);

export default () => (
  <Provider store={store}>
    <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
      <Router history={history} routes={routes} />
      <DevTools />
    </div>
  </Provider>
);
