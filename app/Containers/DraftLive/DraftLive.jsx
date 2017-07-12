import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import Immutable from 'immutable';
import CircularProgress from 'material-ui/CircularProgress';
import Seat from 'Containers/Seat';
import axios from 'axios';

const baseUrl = 'http://localhost:5002/mtglimited-154323/us-central1/';

export default class DraftLive extends React.Component {
  static propTypes = {
    selectedSet: PropTypes.string,
    seats: PropTypes.shape(),
    firebase: PropTypes.shape(),
    sets: PropTypes.shape(),
    auth: PropTypes.shape().isRequired,
    roomId: PropTypes.string.isRequired,
  };

  pickCard = (cardIndex) => {
    const { seats, roomId, auth: { uid } } = this.props;
    const seatId = seats.findKey(seat => seat.get('owner') === uid);

    return axios.get(`${baseUrl}pickCard?seatId=${seatId}&$roomId=${roomId}&cardIndex=${cardIndex}`);
  }

  openBoosterPack = () => {
    const { seats, auth: { uid } } = this.props;
    const seatId = seats.findKey(seat => seat.get('owner') === uid);

    return axios.get(`${baseUrl}openBoosterPack?seatId=${seatId}`);
  }

  render() {
    const { seats, auth, sets, selectedSet, firebase, roomId } = this.props;
    const seatId = seats.findKey(s => s.get('owner') === auth.uid);
    const seat = seats.get(seatId);
    if (!seat) {
      return <CircularProgress />;
    }
    const boosterQueue = seat.get('boosterQueue', new Immutable.Map());
    const packNumber = seat.get('packNumber');
    const pickNumber = seat.get('pickNumber');
    const canOpenPack = boosterQueue.count() === 0 && seat.get('packNumber') < 3 && seat.get('pickNumber') % 15 === 0;
    const boosterSet = sets.getIn([selectedSet, 'draftOrder', packNumber - 1]);

    return (
      <div>
        <h1>Draft Live</h1>
        <h2>Pack Number {packNumber}</h2>
        <h2>Pick Number {pickNumber}</h2>
        { canOpenPack &&
          <RaisedButton
            label={`Open a ${boosterSet} booster pack`}
            secondary
            onTouchTap={this.openBoosterPack}
          />
        }
        <Seat
          roomId={roomId}
          seat={seat}
          auth={auth}
          seatId={seatId}
          sets={sets}
          pickCard={this.pickCard}
          firebase={firebase}
          boosterSet={boosterSet}
        />
      </div>
    );
  }
}
