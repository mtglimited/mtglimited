import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { browserHistory } from 'react-router';

const Lobby = () => (
  <div>
    <h1>Lobby</h1>
    <RaisedButton
      label="Create new room"
      onTouchTap={() => browserHistory.push('/draft/1234')}
    />
  </div>
);

export default Lobby;
