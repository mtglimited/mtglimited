import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from 'Components/App';
import Dashboard from 'Containers/Dashboard';
import NotFound from 'Components/NotFound';
import QuestPage from 'Containers/QuestPage';
import Home from 'Components/Home';

export default (
  <Route path="/" component={App} >
    <IndexRoute component={Home} />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/quests/:id" component={QuestPage} />
    <Route path="*" component={NotFound} />
  </Route>
);
