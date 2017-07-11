import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import Booster from 'Containers/Booster';

export default class Seat extends React.Component {
  static propTypes = {
    sets: PropTypes.shape().isRequired,
    seat: PropTypes.shape(),
    seatId: PropTypes.string.isRequired,
    auth: PropTypes.shape().isRequired,
    passPack: PropTypes.func.isRequired,
    firebase: PropTypes.shape().isRequired,
    selectedSet: PropTypes.shape().isRequired,
  };

  pickCard = async (boosterId, index, data, booster) => {
    const { passPack, firebase, seat, seatId, auth: { uid } } = this.props;
    const set = booster.get('set');
    const pickNumber = seat.get('pickNumber');
    const packNumber = seat.get('packNumber');
    const packToPassKey = seat.get('boosterQueue').keySeq().first();
    const packToPass = seat.get('boosterQueue').first();
    const collection = seat.get('collection');
    const unpickedCards = booster.get('cards').filterNot(card => card.get('pickNumber') >= 0);

    await firebase.set(`boosters/${boosterId}/cards/${index}/pickNumber`, pickNumber);

    if (unpickedCards.count() > 1) {
      await passPack(seatId, packToPass, packNumber);
    }

    await firebase.remove(`seats/${seatId}/boosterQueue/${packToPassKey}`);
    await firebase.set(`seats/${seatId}/pickNumber`, pickNumber + 1);
    await firebase.push(`collections/${collection}/cards`, {
      pickNumber,
      index,
      set,
    });
    await firebase.set(`boosters/${boosterId}/cards/${index}/owner`, uid);
  }

  render() {
    const { sets, seat, seatId, selectedSet } = this.props;
    if (!(seat && sets)) {
      return null;
    }

    const packNumber = seat.get('packNumber') - 1;
    const setKey = sets.getIn([selectedSet, 'draftOrder', packNumber]);
    const set = sets.get(setKey);
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
            pickCard={this.pickCard}
          />
        }
      </div>
    );
  }
}
