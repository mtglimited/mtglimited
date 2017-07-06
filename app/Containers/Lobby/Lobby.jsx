import React from 'react';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { firebaseConnect } from 'react-redux-firebase';
import RaisedButton from 'material-ui/RaisedButton';
import { browserHistory } from 'react-router';
import { List, ListItem } from 'material-ui/List';

@firebaseConnect(['rooms'])
@connect(({ firebase: { data: { rooms } } }) => ({ rooms }))
export default class Lobby extends React.Component {
  static propTypes = {
    rooms: PropTypes.object,
    firebase: PropTypes.shape().isRequired,
  };

  createRoom = async () => {
    const { firebase } = this.props;
    const owner = firebase.auth().currentUser.uid;
    const name = 'New Draft Room';
    const ref = firebase.push('rooms', {
      owner,
      name,
      seats: false,
      set: false,
    });

    browserHistory.push(`/rooms/${ref.key}`);
  }

  render() {
    const rooms = fromJS(this.props.rooms || {});

    return (
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
        <span style={{ display: 'flex' }}>
          <h2 style={{ flex: 1, margin: 0 }}>Lobby</h2>
          <RaisedButton
            label="Create new room"
            onTouchTap={this.createRoom}
          />
        </span>
        {rooms &&
          <List style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
            {rooms.count() === 0 &&
              <p>There are no current open drafts. Create a new one!</p>
            }
            {rooms.map((room, key) => (
              <ListItem
                key={key} // eslint-disable-line
                primaryText={room.get('name')}
                onTouchTap={() => browserHistory.push(`/rooms/${key}`)}
              />
            )).valueSeq()}
          </List>
        }
      </div>
    );
  }
}
