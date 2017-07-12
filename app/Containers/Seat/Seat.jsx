import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import Booster from 'Containers/Booster';

const Seat = ({ sets, seat, seatId, boosterSet, pickCard }) => {
  if (!(seat && sets)) {
    return null;
  }

  const set = sets.get(boosterSet);
  const boosterQueue = seat.get('boosterQueue', new Immutable.List());
  const boosterId = boosterQueue.first();

  // TODO: display collection container
  return (
    <div>
      {boosterId &&
        <Booster
          set={set}
          seatId={seatId}
          boosterId={boosterId}
          pickCard={pickCard}
        />
      }
    </div>
  );
};

Seat.propTypes = {
  sets: PropTypes.shape().isRequired,
  seat: PropTypes.shape(),
  seatId: PropTypes.string.isRequired,
  pickCard: PropTypes.func.isRequired,
  boosterSet: PropTypes.string.isRequired,
};

export default Seat;
