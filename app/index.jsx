import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from 'Containers/Root';
import 'scss/index.scss';
import thirdparty from './thirdparty';

thirdparty();

const rootEl = document.getElementById('root');
const render = Component =>
  ReactDOM.render( // eslint-disable-line react/no-render-return-value
    <AppContainer>
      <Component />
    </AppContainer>,
    rootEl,
  );

render(Root);
if (module.hot) module.hot.accept('Containers/Root', () => render(Root));
