import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from 'Components/App';
import DraftRoom from 'Containers/DraftRoom';
import NotFound from 'Components/NotFound';
import Lobby from 'Containers/Lobby';

export default (
  <Route path="/" component={App} >
    <IndexRoute component={Lobby} />
    <Route path="/draft/:roomId" component={DraftRoom} />
    <Route path="*" component={NotFound} />
  </Route>
);
