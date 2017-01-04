import React from 'react';
import { Route } from 'react-router';
import Draft from './Draft';
import SetSelector from './Containers/SetSelector';

export default (
  <Route path="draft" component={Draft} >
    <Route path="*" component={SetSelector} />
  </Route>
);
