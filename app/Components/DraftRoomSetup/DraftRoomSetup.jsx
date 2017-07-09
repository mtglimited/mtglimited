import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Immutable from 'immutable';
import Avatar from 'material-ui/Avatar';
import Title from 'Components/Title';

import Box from 'grommet/components/Box';
import Select from 'grommet/components/Select';
import Label from 'grommet/components/Label';
import Button from 'grommet/components/Button';
import Columns from 'grommet/components/Columns';

import { SEAT_COUNT_OPTIONS } from './constants';

export default class DraftRoomSetup extends React.Component {
  static propTypes = {
    auth: PropTypes.shape().isRequired,
    firebase: PropTypes.shape().isRequired,
    roomId: PropTypes.string.isRequired,
    room: ImmutablePropTypes.map.isRequired,
    sets: ImmutablePropTypes.map.isRequired,
    seats: ImmutablePropTypes.map.isRequired,
    leaveDraft: PropTypes.func.isRequired,
    joinDraft: PropTypes.func.isRequired,
    startDraft: PropTypes.func.isRequired,
  };

  getEmptySeat = index => (
    <Box
      key={index}
      margin="small"
      pad="medium"
    >
      <Label>{`Seat ${index + 1}`}</Label>

      <Button
        onClick={() => this.props.joinDraft(index)}
        label="Join"
      />
    </Box>
  );

  getSeatWithUser = (seat, index) => {
    const owner = seat.get('owner');
    const primaryText = `Seat ${index + 1}: ${owner.get('displayName')}`;

    return (
      <Box
        key={index}
        primaryText={primaryText}
        leftIcon={<Avatar src={owner.get('avatarUrl')} />}
      >
        {primaryText}
      </Box>
    );
  }

  render() {
    const { firebase, roomId, room, auth,
      startDraft, leaveDraft, seats, sets } = this.props;
    const numberOfSeats = room.get('numberOfSeats') || SEAT_COUNT_OPTIONS.get(0);
    const setOptions = sets.map(set => ({
      label: set.get('name'),
      value: set.get('code'),
    })).toArray();
    const userInSeat = !!seats.find(seat => seat.getIn(['owner', 'uid']) === auth.uid);

    return (
      <Box pad="small">
        <Title
          name={room.get('name')}
          setName={name => firebase.set(`rooms/${roomId}/name`, name)}
        />
        <Box direction="row" full>
          <Box
            colorIndex="light-2"
            pad="medium"
            basis="1/4"
            justify="between"
          >
            <Box>
              <Label size="small">
                Card Set
              </Label>
              <Select
                options={setOptions}
                value={room.get('set')}
                onChange={({ option }) => firebase.set(`rooms/${roomId}/set`, option.value)}
              />
            </Box>
            <Box>
              <Label size="small">
                Number of Players
              </Label>
              <Select
                inline
                options={SEAT_COUNT_OPTIONS.toArray()}
                value={numberOfSeats}
                onChange={({ option }) => firebase.set(`rooms/${roomId}/numberOfSeats`, option)}
              />
            </Box>
            { userInSeat &&
              <Button
                label="Leave"
                onTouchTap={leaveDraft}
              />
            }
            <Button
              primary
              onClick={seats && seats.count() === numberOfSeats ? startDraft : null}
              label="Start Draft"
            />
          </Box>
          <Box flex pad="medium">
            {!auth.isEmpty &&
            <Columns
              size="small"
              justify="center"
            >
              {Immutable.Range(0, numberOfSeats).map((index) => {
                const seat = seats.find(s => s.get('index') === index);
                if (!seat) {
                  return this.getEmptySeat(index);
                }

                return this.getSeatWithUser(seat, index);
              })}
            </Columns>
}
          </Box>
        </Box>
      </Box>
    );
  }
}
