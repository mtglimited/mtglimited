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
    auth: PropTypes.shape().isRequired,
    firebase: PropTypes.shape().isRequired,
    roomId: PropTypes.string.isRequired,
    room: ImmutablePropTypes.map.isRequired,
    sets: ImmutablePropTypes.map.isRequired,
    seats: ImmutablePropTypes.map.isRequired,
    getUpFromSeat: PropTypes.func.isRequired,
    joinDraft: PropTypes.func.isRequired,
    startDraft: PropTypes.func.isRequired,
  };

  getEmptySeat = index => (
    <ListItem
      key={index}
      primaryText={`Seat ${index + 1} (open)`}
      leftIcon={<AccountCircle />}
      onTouchTap={() => this.props.joinDraft(index)}
    />
  );

  getSeatWithUser = (seat, index) => {
    const { getUpFromSeat } = this.props;
    const owner = seat.get('owner');
    const primaryText = `Seat ${index + 1}: ${owner.get('displayName')}`;

    return (
      <ListItem
        key={index}
        primaryText={primaryText}
        leftIcon={<Avatar src={owner.get('avatarUrl')} />}
        rightIcon={<Clear onTouchTap={event => getUpFromSeat(event, index)} />}
      />
    );
  }

  render() {
    const { firebase, roomId, room, auth, startDraft, seats, sets } = this.props;
    const numberOfSeats = room.numberOfSeats || SEAT_COUNT_OPTIONS.get(0);

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
              key={set.get('code')}
              value={set.get('code')}
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

        {!auth.isEmpty &&
          <List>
            {Immutable.Range(0, numberOfSeats).map((index) => {
              const seat = seats.get(String(index));
              if (!seat) {
                return this.getEmptySeat(index);
              }

              return this.getSeatWithUser(seat, index);
            })}
          </List>
        }
        <RaisedButton
          label="Start Draft"
          style={{ display: 'flex' }}
          primary
          onTouchTap={startDraft}
          disabled={!seats || !(seats.count() === numberOfSeats)}
        />
      </div>
    );
  }
}
