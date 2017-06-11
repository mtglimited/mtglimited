import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { firebaseConnect, populatedDataToJS, pathToJS } from 'react-redux-firebase';
import Immutable, { fromJS } from 'immutable';
import DraftRoomSetup from 'Components/DraftRoomSetup';

const roomPopulates = [
  { child: 'owner', root: 'users' },
];

const seatPopulates = [
  { child: 'owner', root: 'users' },
];

const mapStateToProps = ({ firebase }, ownProps) => ({
  room: fromJS(populatedDataToJS(firebase, `rooms/${ownProps.params.roomId}`, roomPopulates)),
  seats: fromJS(populatedDataToJS(firebase, 'seats', seatPopulates)),
  sets: fromJS(populatedDataToJS(firebase, 'sets')),
  auth: pathToJS(firebase, 'auth'),
});

@firebaseConnect(ownProps => [
  {
    path: `rooms/${ownProps.params.roomId}`,
    populates: roomPopulates,
  },
  '/sets',
  `seats#orderByChild=room&equalTo=${ownProps.params.roomId}`,
])
@connect(mapStateToProps)
export default class DraftRoom extends React.Component {
  static propTypes = {
    room: PropTypes.shape(), // eslint-disable-line
    firebase: PropTypes.shape().isRequired,
    params: PropTypes.shape().isRequired,
    seats: PropTypes.shape(),
    sets: PropTypes.shape(),
  };

  static defaultProps = {
    profile: Immutable.Map(),
    sets: Immutable.Map(),
    seats: Immutable.Map(),
  };

  getUpFromSeat = (event, index) => {
    const { firebase, seats, params } = this.props;
    const seatKey = seats && seats.findKey(s => s.get('index') === index);
    const seat = seats.find(s => s.get('index') === index);
    const userId = firebase.auth().currentUser.uid;
    event.stopPropagation();

    firebase.remove(`seats/${seatKey}`);
    firebase.remove(`users/${userId}/seat`);
    firebase.remove(`rooms/${params.roomId}/seats/${seat.get('roomSeatId')}`);
  }

  startDraft = () => {
    const { firebase, params } = this.props;
    firebase.set(`rooms/${params.roomId}/isDraftStarted`, true);
  }

  chooseSet = (event, key, value) => {
    const { firebase, params } = this.props;
    firebase.set(`rooms/${params.roomId}/set`, value);
  }

  joinDraft = (index) => {
    const { firebase, params, seats } = this.props;
    const userId = firebase.auth().currentUser.uid;
    if (seats) {
      const hasSeat = seats.find(seat => seat.getIn(['owner', 'uid']) === userId);

      if (hasSeat) {
        return;
      }
    }

    const seatRef = firebase.push('seats', {
      owner: userId,
      room: params.roomId,
      index,
    });
    const roomSeatRef = firebase.push(`rooms/${params.roomId}/seats`, seatRef.key);
    seatRef.update({
      roomSeatId: roomSeatRef.key,
    });
    firebase.set(`users/${userId}/seat`, roomSeatRef.key);
  }

  startDraft = () => {
    const { firebase, params } = this.props;
    firebase.push(`rooms/${params.roomId}/isLive`, true);
  }

  render() {
    const { room, params, sets, firebase, seats } = this.props;
    if (!room) {
      return null;
    }

    return (
      <div style={{ margin: 15, display: 'flex', flexDirection: 'column' }}>
        <DraftRoomSetup
          room={room}
          seats={seats}
          sets={sets}
          roomId={params.roomId}
          firebase={firebase}
          getUpFromSeat={this.getUpFromSeat}
          joinDraft={this.joinDraft}
          startDraft={this.startDraft}
        />
      </div>
    );
  }
}
