import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Immutable from 'immutable';
import Title from 'Components/Title';

import Box from 'grommet/components/Box';
import Select from 'grommet/components/Select';
import Label from 'grommet/components/Label';
import Button from 'grommet/components/Button';
import Tiles from 'grommet/components/Tiles';

import { SEAT_COUNT_OPTIONS } from './constants';
import Seat from './Seat';

const DraftRoomSetup = (props) => {
  const {
      firebase,
      roomId,
      room,
      auth,
      startDraft,
      joinDraft,
      seats,
      sets,
      users,
    } = props;
  const numberOfSeats = room.get('numberOfSeats') || SEAT_COUNT_OPTIONS.get(0);
  const setOptions = sets.map(set => ({
    label: set.get('name'),
    value: set.get('code'),
  })).toArray();

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
          <Button
            primary
            onClick={seats && seats.count() === numberOfSeats ? startDraft : null}
            label="Start Draft"
          />
        </Box>
        <Box flex pad="medium">
          {!auth.isEmpty &&
            <Tiles flush={false} fill>
              {Immutable.Range(0, numberOfSeats).map((index) => {
                const seatId = room.getIn(['seats', index]);
                const seat = seatId && seats.get(seatId);
                const seatOwner = seat && users.get(seat.get('owner'));

                return (
                  <Seat
                    key={seatId}
                    index={index}
                    seatOwner={seatOwner}
                    joinDraft={joinDraft}
                  />
                );
              })}
            </Tiles>
          }
        </Box>
      </Box>
    </Box>
  );
};

DraftRoomSetup.propTypes = {
  auth: PropTypes.shape().isRequired,
  firebase: PropTypes.shape().isRequired,
  roomId: PropTypes.string.isRequired,
  room: ImmutablePropTypes.map.isRequired,
  sets: ImmutablePropTypes.map.isRequired,
  seats: ImmutablePropTypes.map.isRequired,
  joinDraft: PropTypes.func.isRequired,
  startDraft: PropTypes.func.isRequired,
  users: ImmutablePropTypes.map.isRequired,
};

export default DraftRoomSetup;
