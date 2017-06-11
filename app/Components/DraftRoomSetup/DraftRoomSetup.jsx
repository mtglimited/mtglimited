import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Immutable from 'immutable';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import Clear from 'material-ui/svg-icons/content/clear';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Title from 'Components/Title';

import { SEAT_COUNT_OPTIONS } from './constants';

export default class DraftRoomSetup extends React.Component {
  static propTypes = {
    firebase: PropTypes.shape().isRequired,
    roomId: PropTypes.string.isRequired,
    room: ImmutablePropTypes.map.isRequired,
    sets: ImmutablePropTypes.map.isRequired,
    seats: ImmutablePropTypes.map.isRequired,
    getUpFromSeat: PropTypes.func.isRequired,
    joinDraft: PropTypes.func.isRequired,
    startDraft: PropTypes.func.isRequired,
  };

  getSeatListItem = (index) => {
    const { seats, getUpFromSeat, joinDraft } = this.props;
    const seat = seats && seats.find(s => s.get('index') === index);

    if (seat) {
      const primaryText = `Seat ${index + 1}: ${seat.getIn(['owner', 'displayName'])}`;
      return (
        <ListItem
          key={index}
          primaryText={primaryText}
          leftIcon={<Avatar src={seat.getIn(['owner', 'avatarUrl'])} />}
          rightIcon={<Clear onTouchTap={event => getUpFromSeat(event, index)} />}
        />
      );
    }
    return (
      <ListItem
        key={index}
        primaryText={`Seat ${index + 1} (open)`}
        leftIcon={<AccountCircle />}
        onTouchTap={() => joinDraft(index)}
      />
    );
  }
  render() {
    const { firebase, roomId, room, sets, seats } = this.props;
    const numberOfSeats = room.get('numberOfSeats', SEAT_COUNT_OPTIONS.get(0));
    return (
      <div>
        <Title
          name={room.get('name')}
          setName={name => firebase.set(`rooms/${roomId}/name`, name)}
        />
        <SelectField
          floatingLabelText="Set"
          value={room.get('set')}
          onChange={(event, key, value) => firebase.set(`rooms/${roomId}/set`, value)}
        >
          {sets.valueSeq().map(set => (
            <MenuItem
              key={set.get('abbr')}
              value={set.get('abbr')}
              primaryText={set.get('name')}
            />
          ))}
        </SelectField>
        <SelectField
          floatingLabelText="Number of Players"
          value={numberOfSeats}
          onChange={(event, key, value) => firebase.set(`rooms/${roomId}/numberOfSeats`, value)}
        >
          {SEAT_COUNT_OPTIONS.map(number => (
            <MenuItem
              key={number}
              value={number}
              primaryText={number}
            />
          ))}
        </SelectField>

        {firebase.auth().currentUser &&
          <List>
            {Immutable.Range(0, numberOfSeats).map(index => this.getSeatListItem(index))}
          </List>
        }
        <RaisedButton
          label="Start Draft"
          style={{ display: 'flex' }}
          primary
          onTouchTap={this.props.startDraft}
          disabled={!seats || !(seats.count() === numberOfSeats)}
        />
      </div>
    );
  }
}
