import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import Immutable from 'immutable';
import CircularProgress from 'material-ui/CircularProgress';
import Seat from 'Containers/Seat';

export default class DraftLive extends React.Component {
  static propTypes = {
    selectedSet: PropTypes.string,
    seats: PropTypes.shape(),
    firebase: PropTypes.shape(),
    sets: PropTypes.shape(),
    auth: PropTypes.shape().isRequired,
    room: PropTypes.shape().isRequired,
  };

  getRandomCard = cards => cards.get(Math.floor(Math.random() * Math.floor(cards.size)));

  isMythicRare = () => Math.floor(Math.random() * Math.floor(7)) === 1;

  createBooster = async () => {
    const { firebase, roomId, seats, sets, selectedSet, auth } = this.props;
    const owner = auth.uid;
    const seatId = seats.findKey(seat => seat.get('owner') === owner);
    const seat = seats.get(seatId);

    const packNumber = seat.get('packNumber');
    const set = sets.get(selectedSet);
    const packSet = set.getIn(['draftOrder', packNumber]);
    const cardsByRarity = sets.getIn([packSet, 'cards']).groupBy(card => card && card.get('rarity').toLowerCase());
    const cards = sets.get(packSet)
      .get('booster')
      .filterNot(rarity => rarity === 'land' || rarity === 'marketing')
      .map((rarity) => {
        let rarityKey = rarity;

        if (typeof rarity === 'object') {
          rarityKey = this.isMythicRare() ? 'mythic rare' : 'rare';
        }

        const cardChoices = cardsByRarity.get(rarityKey);
        const randomCard = this.getRandomCard(cardChoices);
        const randomCardIndex = sets.getIn([packSet, 'cards']).findKey(card => card && card.get('id') === randomCard.get('id'));

        return {
          data: randomCardIndex,
        };
      });

    const booster = {
      cards: cards.toJS(),
      owner,
      roomId,
      seatId,
      set: packSet,
    };

    const boosterRef = await firebase.push('boosters', booster);

    await firebase.push(`/seats/${seatId}/boosterQueue`, boosterRef.key);
    await firebase.set(`/seats/${seatId}/pickNumber`, 1);
    await firebase.set(`/seats/${seatId}/packNumber`, packNumber + 1);
  }

  passPack = async (seatId, packToPass, packNumber) => {
    const { firebase, room } = this.props;
    const numberOfSeats = room.get('seats').size;
    let seatIndex = room.get('seats').findKey(id => id === seatId);
    if (packNumber % 2) {
      seatIndex -= 1; // left
    } else {
      seatIndex += 1; // right
    }
    const seatToPass = room.getIn(['seats', seatIndex % numberOfSeats]);
    await firebase.push(`seats/${seatToPass}/boosterQueue`, packToPass);
  }

  render() {
    const { seats, auth, sets, selectedSet, firebase } = this.props;
    const seatId = seats.findKey(s => s.get('owner') === auth.uid);
    const seat = seats.get(seatId);
    if (!seat) {
      return <CircularProgress />;
    }
    const boosterQueue = seat.get('boosterQueue', new Immutable.Map());
    const packNumber = seat.get('packNumber');
    const pickNumber = seat.get('pickNumber');
    const canOpenPack = boosterQueue.count() === 0 && seat.get('packNumber') < 3 && seat.get('pickNumber') % 15 === 0;
    const boosterSet = sets.getIn([selectedSet, 'draftOrder', packNumber]);

    return (
      <div>
        <h1>Draft Live</h1>
        <h2>Pack Number {packNumber}</h2>
        <h2>Pick Number {pickNumber}</h2>
        { canOpenPack &&
          <RaisedButton
            label={`Open a ${boosterSet} booster pack`}
            secondary
            onTouchTap={this.createBooster}
          />
        }
        <Seat
          seat={seat}
          auth={auth}
          seatId={seatId}
          sets={sets}
          passPack={this.passPack}
          firebase={firebase}
          selectedSet={selectedSet}
        />
      </div>
    );
  }
}
