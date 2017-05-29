import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { firebaseConnect, populatedDataToJS } from 'react-redux-firebase';
import Immutable, { fromJS } from 'immutable';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import { List, ListItem } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';

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
  sets: firebase.getIn(['data', 'sets']),
});

@firebaseConnect(ownProps => [
  {
    path: `rooms/${ownProps.params.roomId}`,
    populates: roomPopulates,
  },
  'sets',
  `seats#orderByChild=room&equalTo=${ownProps.params.roomId}`,
])
@connect(mapStateToProps)
class DraftRoom extends React.Component {
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

  getSeatListItem = (index) => {
    const { seats } = this.props;
    const seat = seats && seats.find(s => s.get('index') === index);
    if (seat) {
      return (
        <ListItem
          key={index}
          primaryText={`Seat ${index + 1}`}
          leftIcon={<AccountCircle />}
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
    const { firebase, params } = this.props;
    const userId = firebase.auth().currentUser.uid;
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
        {seats && seats.count() === SEAT_COUNT &&
          <RaisedButton label="Start Draft" primary />
        }
        <DropDownMenu
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
        <List>
          {Immutable.Range(0, SEAT_COUNT).map(index => this.getSeatListItem(index))}
        </List>
      </div>
    );
  }
}

export default DraftRoom;
