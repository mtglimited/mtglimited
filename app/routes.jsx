import React from 'react';
import { Route } from 'react-router';
import App from 'components/App';
import NotFound from 'components/NotFound';

export default (
  <Route path="/" component={App} >
    <Route path="*" component={NotFound} />
  </Route>
);
