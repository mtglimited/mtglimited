import React from 'react';
import { Route } from 'react-router';
import App from 'Components/App';
import DraftRoutes from 'Modules/Draft/routes';
import NotFound from 'Components/NotFound';

export default (
  <Route path="/" component={App} >
    {DraftRoutes}
    <Route path="*" component={NotFound} />
  </Route>
);
