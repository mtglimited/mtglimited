import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import Booster from 'Containers/Booster';

export default class DraftLive extends React.Component {
  static propTypes = {
    selectedSet: PropTypes.string,
    roomId: PropTypes.string,
    seats: PropTypes.shape(),
    firebase: PropTypes.shape(),
    sets: PropTypes.shape(),
    auth: PropTypes.shape().isRequired,
  };

  getRandomCard = cards => cards[Math.floor(Math.random() * Math.floor(cards.length))];
  isMythicRare = () => Math.floor(Math.random() * Math.floor(7)) === 1;

  createBooster = async () => {
    const { firebase, roomId, seats, sets, selectedSet, auth } = this.props;
    const set = sets.get(selectedSet);
    const cardsByRarity = set.get('hashedCards').groupBy(card => card.get('rarity').toLowerCase());
    const owner = auth.uid;

    const cards = set
      .get('booster')
      .filterNot(rarity => rarity === 'land' || rarity === 'marketing')
      .map((rarity) => {
        let rarityKey = rarity;

        if (typeof rarity === 'object') {
          rarityKey = this.isMythicRare() ? 'mythic rare' : 'rare';
        }

        const cardChoices = cardsByRarity.get(rarityKey).keySeq().toArray();
        const randomCardKey = this.getRandomCard(cardChoices);
        // return set.getIn(['hashedCards', randomCardKey]);
        return {
          data: randomCardKey,
        };
      })
      .set('owner', owner)
      .set('room', roomId)
      .toJS();

    const booster = {
      cards,
      owner,
      roomId,
      set: selectedSet,
    };

    const boosterRef = await firebase.push('boosters', booster);
    const seatId = seats.findKey(seat => seat.getIn(['owner', 'uid']) === owner);
    firebase.set(`/seats/${seatId}/activeBooster`, boosterRef.key);
  }

  pickCard = (boosterId, index, cardId) => {
    const { firebase, seats, auth } = this.props;
    const owner = auth.uid;
    const seatId = seats.findKey(seat => seat.getIn(['owner', 'uid']) === owner);
    firebase.set(`boosters/${boosterId}/cards/${index}/isPicked`, true);
    firebase.push(`seats/${seatId}/collection`, {
      data: cardId,
    });
  }

  render() {
    const { seats, auth, sets, selectedSet } = this.props;
    const owner = auth.uid;
    const seat = seats.find(s => s.getIn(['owner', 'uid']) === owner);
    const setData = sets.get(selectedSet);
    if (!seat) {
      return <CircularProgress />;
    }

    return (
      <div>
        <h1>Draft Live</h1>
        <FlatButton
          label="Generate a booster pack"
          primary
          onTouchTap={() => this.createBooster()}
        />
        {seat.get('activeBooster') &&
          <Booster
            boosterId={seat.get('activeBooster')}
            set={setData}
            pickCard={this.pickCard}
          />
        }
      </div>
    );
  }
}
