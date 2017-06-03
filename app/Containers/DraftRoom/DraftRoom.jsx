import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { firebaseConnect, populatedDataToJS, pathToJS } from 'react-redux-firebase';
import Immutable, { fromJS } from 'immutable';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import Clear from 'material-ui/svg-icons/content/clear';
import { List, ListItem } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';

const SEAT_COUNT = 8;

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
    room: PropTypes.shape(),
    firebase: PropTypes.shape(),
    params: PropTypes.shape(),
    seats: PropTypes.shape(),
    sets: PropTypes.shape(),
  };

  static defaultProps = {
    room: Immutable.Map(),
    profile: Immutable.Map(),
    sets: Immutable.Map(),
    seats: Immutable.Map(),
  };

  getUpFromSeat = (event, index) => {
    const { firebase, seats, params } = this.props;
    const seatKey = seats && seats.findKey(s => s.get('index') === index);
    const userId = firebase.auth().currentUser.uid;
    event.stopPropagation();
    firebase.remove(`seats/${seatKey}`);
    firebase.remove(`users/${userId}/seat`);
    firebase.remove(`rooms/${params.roomId}/seats/${seatKey}`);
  }

  getSeatListItem = (index) => {
    const { seats } = this.props;
    const seat = seats && seats.find(s => s.get('index') === index);

    if (seat) {
      const primaryText = `Seat ${index + 1}: ${seat.getIn(['owner', 'displayName'])}`;
      return (
        <ListItem
          key={index}
          primaryText={primaryText}
          leftIcon={<Avatar src={seat.getIn(['owner', 'avatarUrl'])} />}
          rightIcon={<Clear onTouchTap={event => this.getUpFromSeat(event, index)} />}
        />
      );
    }
    return (
      <ListItem
        key={index}
        primaryText={`Seat ${index + 1} (open)`}
        leftIcon={<AccountCircle />}
        onTouchTap={() => this.joinDraft(index)}
      />
    );
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
      // eslint-disable-next-line
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
    firebase.set(`users/${userId}/seat`, roomSeatRef.key);
  }

  render() {
    const { room, params, sets, firebase, seats } = this.props;

    return (
      <div style={{ margin: 15 }}>
        <h2>{room.get('name')}</h2>
        <DropDownMenu
          style={{ display: 'flex' }}
          value={room.get('set')}
          onChange={(event, key, value) => firebase.set(`rooms/${params.roomId}/set`, value)}
        >
          <MenuItem primaryText="Select a set" value={false} />
          {sets.valueSeq().map(set => (
            <MenuItem
              key={set.get('abbr')}
              value={set.get('abbr')}
              primaryText={set.get('name')}
            />
          ))}
        </DropDownMenu>
        {firebase.auth().currentUser &&
          <List>
            {Immutable.Range(0, SEAT_COUNT).map(index => this.getSeatListItem(index))}
          </List>
        }
        <RaisedButton
          label="Start Draft"
          style={{ display: 'flex' }}
          primary
          disabled={!seats || !(seats.count() === SEAT_COUNT)}
        />
      </div>
    );
  }
}
