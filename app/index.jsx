import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
// http://www.material-ui.com/#/get-started/installation --- Remove when react has this natively
import injectTapEventPlugin from 'react-tap-event-plugin';

import Root from 'containers/Root';

injectTapEventPlugin();

const rootEl = document.getElementById('root');

render(
  <AppContainer>
    <Root />
  </AppContainer>,
  rootEl,
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NewRoot = require('./containers/Root').default;

    render(
      <AppContainer>
        <NewRoot />
      </AppContainer>,
      rootEl,
    );
  });
}
