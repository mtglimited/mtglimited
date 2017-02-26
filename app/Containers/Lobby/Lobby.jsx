import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import * as Colyseus from 'colyseus.js';
import { browserHistory, Link } from 'react-router';
import axios from 'axios';

class Lobby extends React.Component {
  state = {
    rooms: {},
  };

  componentDidMount() {
    // fetch all rooms
    axios('https://localhost:2657/rooms').then((response) => {
      this.setState({
        rooms: response.data.rooms,
      });
    });
  }

  createDraftRoom = () => {
    const config = {
      id: this.client.id,
    };
    console.log(this.client.id);
    axios.put('https://localhost:2657/rooms', config).then(() => {
      browserHistory.push(`/draft/${config.id}`);
    });
  }

  client = new Colyseus.Client('wss://localhost:2657');

  render() {
    const { rooms } = this.state;
    console.log(rooms);

    return (
      <div>
        <h1>Lobby</h1>
        <RaisedButton
          label="Create new room"
          onTouchTap={this.createDraftRoom}
        />
        <ul>
          {Object.keys(rooms).map(id => (
            <li key={id}>
              <Link to={rooms[id].roomName}>{rooms[id].roomName}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Lobby;
