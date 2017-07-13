import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from 'Components/App';
import DraftRoom from 'Containers/DraftRoom';
import ManageSets from 'Containers/ManageSets';
import ManageSet from 'Containers/ManageSet';
import NotFound from 'Components/NotFound';
import Lobby from 'Containers/Lobby';
import Authentication from 'Containers/Authentication';

export default (
  <Route path="/" component={App} >
    <IndexRoute component={Lobby} />
    <Route path="/sets/:code" component={ManageSet} />
    <Route path="/sets" component={ManageSets} />
    <Route component={Authentication}>
      <Route path="/rooms/:roomId" component={DraftRoom} />
    </Route>
    <Route path="*" component={NotFound} />
  </Route>
);
