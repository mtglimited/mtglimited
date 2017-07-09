import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import { firebaseConnect, populate } from 'react-redux-firebase';
import DraftRoomSetup from 'Components/DraftRoomSetup';
import DraftLive from 'Containers/DraftLive';

const populates = [
  { child: 'owner', root: 'users' },
];

@firebaseConnect(ownProps => [
  `rooms/${ownProps.params.roomId}`,
  'sets',
  `seats#populate=owner:users&orderByChild=room&equalTo=${ownProps.params.roomId}`,
])
@connect(({ firebase }, { params }) => ({
  room: firebase.data.rooms && fromJS(firebase.data.rooms[params.roomId]),
  seats: fromJS(populate(firebase, 'seats', populates)),
  sets: fromJS(firebase.data.sets),
  auth: firebase.auth,
}))
export default class DraftRoom extends React.Component {
  static propTypes = {
    room: PropTypes.shape(),
    firebase: PropTypes.shape().isRequired,
    params: PropTypes.shape().isRequired,
    seats: PropTypes.shape(),
    sets: PropTypes.shape(),
    auth: PropTypes.object.isRequired,
  };

  static defaultProps = {
    sets: fromJS({}),
    seats: fromJS({}),
  };

  getUpFromSeat = (event, index) => {
    const { firebase, seats, params, auth } = this.props;
    const seatKey = seats && seats.findKey(s => s.get('index') === index);
    const seat = seats.find(s => s.get('index') === index);
    const userId = auth.uid;
    event.stopPropagation();

    firebase.remove(`seats/${seatKey}`);
    firebase.remove(`users/${userId}/seat`);
    firebase.remove(`rooms/${params.roomId}/seats/${seat.get('roomSeatId')}`);
  }

  getBooster = (key, set) => {
    const { params } = this.props;
    return {
      seat: key,
      room: params.roomId,
      cards: [],
      set,
    };
  }

  joinDraft = (index) => {
    const { firebase, params, seats, auth } = this.props;
    const userId = auth.uid;
    const hasSeat = seats.find(seat => seat.getIn(['owner', 'uid']) === userId);

    if (hasSeat) {
      return;
    }

    firebase.set(`seats/${index}`, {
      owner: userId,
      room: params.roomId,
    });
  }

  chooseSet = (event, key, value) => {
    const { firebase, params } = this.props;
    firebase.set(`rooms/${params.roomId}/set`, value);
  }

  startDraft = () => {
    const { firebase, params } = this.props;
    firebase.set(`rooms/${params.roomId}/isLive`, true);
    // TODO: create collections for each seat?
    // TODO: maybe just let them generate a pack?
    // seats.map((seat, key) => firebase.push('boosters', this.getBooster(key, set)));
  }

  render() {
    if (!this.props.room) {
      return null;
    }

    const { params, firebase, auth, sets, seats, room } = this.props;
    const isLive = room.get('isLive');

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {!isLive &&
          <DraftRoomSetup
            auth={auth}
            room={room}
            seats={seats}
            sets={sets}
            roomId={params.roomId}
            firebase={firebase}
            getUpFromSeat={this.getUpFromSeat}
            joinDraft={this.joinDraft}
            startDraft={this.startDraft}
          />
        }
        {isLive &&
          <DraftLive
            selectedSet={room.get('set')}
            seats={seats}
            roomId={params.roomId}
            sets={sets}
            firebase={firebase}
            auth={auth}
          />
        }
      </div>
    );
  }
}
