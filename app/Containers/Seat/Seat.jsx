import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import Booster from 'Containers/Booster';
import Collection from 'Containers/Collection';

const Seat = ({ sets, seat, seatId, boosterSet, pickCard }) => {
  if (!(seat && sets)) {
    return null;
  }

  const set = sets.get(boosterSet);
  const boosterQueue = seat.get('boosterQueue', new Immutable.List());
  const boosterId = boosterQueue.first();
  const collection = seat.get('collection');
  const packNumber = seat.get('packNumber');
  const pickNumber = seat.get('pickNumber');

  // TODO: display collection container
  return (
    <div>
      <h2>Current Pack</h2>
      <h3>Pack Number {packNumber}, Pick Number {pickNumber}</h3>
      <div style={{ overflowX: 'auto' }}>
        {boosterId &&
          <Booster
            set={set}
            seatId={seatId}
            boosterId={boosterId}
            pickCard={pickCard}
          />
        }
      </div>
      <h3>My Collection</h3>
      <div style={{ overflowX: 'auto' }}>
        {collection &&
          <Collection
            collectionId={collection}
            sets={sets}
          />
        }
      </div>
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
