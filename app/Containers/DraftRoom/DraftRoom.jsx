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
    route: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  static defaultProps = {
    sets: fromJS({}),
    seats: fromJS({}),
  };

  componentDidMount() {
    const { router, route } = this.props;
    router.setRouteLeaveHook(route, this.leaveDraft);
  }

  getSeatKey = () => this.props.seats
      .findKey(s => s.getIn(['owner', 'uid']) === this.props.auth.uid);

  getBooster = (key, set) => {
    const { params } = this.props;
    return {
      seat: key,
      room: params.roomId,
      cards: [],
      set,
    };
  }

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
    const { firebase, params: { roomId } } = this.props;
    firebase.set(`rooms/${roomId}/isLive`, true);
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
            leaveDraft={this.leaftDraft}
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
