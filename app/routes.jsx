import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from 'Components/App';
import DraftRoom from 'Containers/DraftRoom';
import ManageSets from 'Containers/ManageSets';
import ManageSet from 'Containers/ManageSet';
import NotFound from 'Components/NotFound';
import Lobby from 'Containers/Lobby';
import Home from 'Components/Home';
import Profile from 'Containers/Profile';
import Leaderboard from 'Containers/Leaderboard';

export default (
  <Route path="/" component={App} >
    <IndexRoute component={Home} />
    <Route path="/lobby" component={Lobby} />
    <Route path="/sets/:code" component={ManageSet} />
    <Route path="/sets" component={ManageSets} />
    <Route path="/profile" component={Profile} />
    <Route path="/rooms/:roomId" component={DraftRoom} />
    <Route path="/leaderboard" component={Leaderboard} />
    <Route path="*" component={NotFound} />
  </Route>
);
