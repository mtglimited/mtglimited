import React from 'react';
import { Route } from 'react-router';
import App from 'Components/App';
import SetSelector from 'Modules/Draft/Containers/SetSelector';
import DraftLive from 'Modules/Draft/Containers/DraftLive';
import NotFound from 'Components/NotFound';

export default (
  <Route path="/" component={App} >
    <Route path="/draft" component={SetSelector} />
    <Route path="/draft/:activeSet" component={DraftLive} />
    <Route path="*" component={NotFound} />
  </Route>
);
