import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import DraftRoomSetup from 'Components/DraftRoomSetup';
import DraftLive from 'Containers/DraftLive';
import Box from 'grommet/components/Box';

@firebaseConnect(ownProps => [
  `rooms/${ownProps.params.roomId}`,
  'sets',
  `seats#orderByChild=room&equalTo=${ownProps.params.roomId}`,
  'users',
])
@connect(({ firebase }, { params }) => ({
  room: firebase.data.rooms && fromJS(firebase.data.rooms[params.roomId]),
  seats: fromJS(firebase.data.seats),
  sets: fromJS(firebase.data.sets),
  auth: firebase.auth,
  users: fromJS(firebase.data.users),
}))
export default class DraftRoom extends React.Component {
  static propTypes = {
    room: PropTypes.shape(),
    firebase: PropTypes.shape().isRequired,
    params: PropTypes.shape().isRequired,
    seats: PropTypes.shape(),
    sets: PropTypes.shape(),
    auth: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    users: PropTypes.object,
  };

  static defaultProps = {
    sets: fromJS({}),
    seats: fromJS({}),
  };

  componentDidMount() {
    const { router, route } = this.props;
    router.setRouteLeaveHook(route, this.leaveDraft);
  }

  getSeatKey = () => this.props.seats && this.props.seats
      .findKey(s => s.get('owner') === this.props.auth.uid);

  leaveDraft = () => {
    const { firebase, params, auth, seats } = this.props;
    const seatKey = this.getSeatKey();

    if (!seatKey) {
      return;
    }
    const seat = seats.get(seatKey);
    const userId = auth.uid;

    firebase.remove(`seats/${seatKey}`);
    firebase.remove(`users/${userId}/seat`);
    firebase.remove(`rooms/${params.roomId}/seats/${seat.get('roomSeatId')}`);
  }


  joinDraft = async (index) => {
    const { firebase, params, auth } = this.props;
    const userId = auth.uid;
    const { roomId } = params;

    this.leaveDraft();

    const seatRef = await firebase.push('seats', {
      owner: userId,
      room: params.roomId,
    });

    firebase.set(`rooms/${roomId}/seats/${index}`, seatRef.key);
  }

  chooseSet = (event, key, value) => {
    const { firebase, params: { roomId } } = this.props;
    firebase.set(`rooms/${roomId}/set`, value);
  }

  startDraft = () => {
    const { seats, room, firebase, params: { roomId } } = this.props;
    firebase.set(`rooms/${roomId}/isLive`, true);
    room.get('seats').forEach(async (seatId) => {
      const owner = seats.getIn([seatId, 'owner']);
      const collectionRef = await firebase.push('collections', { roomId, owner });
      firebase.set(`seats/${seatId}/collection`, collectionRef.key);
      firebase.set(`seats/${seatId}/packNumber`, 0);
      firebase.set(`seats/${seatId}/pickNumber`, 0);
    });
  }

  render() {
    if (!this.props.room || !this.props.users) {
      return null;
    }

    const { params, firebase, auth, sets, seats, room, users } = this.props;
    const isLive = room.get('isLive');

    return (
      <Box>
        {!isLive &&
          <DraftRoomSetup
            auth={auth}
            users={users}
            room={room}
            seats={seats}
            sets={sets}
            roomId={params.roomId}
            firebase={firebase}
            leaveDraft={this.leaftDraft}
            joinDraft={this.joinDraft}
            startDraft={this.startDraft}
          />
        }
        {isLive &&
          <DraftLive
            room={room}
            selectedSet={room.get('set')}
            seats={seats}
            roomId={params.roomId}
            sets={sets}
            firebase={firebase}
            auth={auth}
          />
        }
      </Box>
    );
  }
}
