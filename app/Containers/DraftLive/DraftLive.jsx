import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import Booster from 'Containers/Booster';

export default class DraftLive extends React.Component {
  static propTypes = {
    selectedSet: PropTypes.string,
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
    const seatId = seats.findKey(seat => seat.getIn(['owner', 'uid']) === owner);
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
      seatId,
      set: selectedSet,
    };

    const boosterRef = await firebase.push('boosters', booster);
    firebase.set(`/seats/${seatId}/activeBooster`, boosterRef.key);
  }

  pickCard = async (boosterId, index, data) => {
    const { selectedSet, firebase, seats, auth: { uid } } = this.props;
    const seatId = seats.findKey(seat => seat.getIn(['owner', 'uid']) === uid);
    const seat = seats.get(seatId);
    const pickIndex = seat.get('pickIndex', 0);
    const card = {
      pickIndex,
      data,
      selectedSet,
    };
    await firebase.set(`boosters/${boosterId}/cards/${index}/pickIndex`, pickIndex);
    await firebase.set(`boosters/${boosterId}/cards/${index}/owner`, uid);
    let collection = seat.get('collection');

    if (!collection) {
      const collectionRef = await firebase.push('collections', {
        owner: uid,
      });
      collection = collectionRef.key;
      await firebase.set(`seats/${seatId}/collection`, collection);
    }
    await firebase.push(`collections/${collection}/cards`, card);
    await firebase.set(`seats/${seatId}/pickIndex`, pickIndex + 1);
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
        <RaisedButton
          label="Generate a booster pack"
          secondary
          onTouchTap={() => this.createBooster()}
        />
        {seat.getIn(['boosterQueue', 0]) &&
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
