import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { firebaseConnect } from 'react-redux-firebase';
import Booster from 'Containers/Booster';

@firebaseConnect(({ seatId }) => [
  `seats/${seatId}`,
])
@connect(({ firebase }, ownProps) => ({
  seat: firebase.data.seats && fromJS(firebase.data.seats[ownProps.seatId]),
  auth: firebase.auth,
}))
export default class Seat extends React.Component {
  static propTypes = {
    set: PropTypes.shape().isRequired,
    seat: PropTypes.shape(),
    seatId: PropTypes.string.isRequired,
    auth: PropTypes.shape().isRequired,
  };

  pickCard = async (boosterId, index, data, set) => {
    const { firebase, seat, seatId, auth: { uid } } = this.props;
    const pickIndex = seat.get('pickIndex', 0);
    const card = {
      pickIndex,
      data,
      set,
    };
    const boosterQueue = seat.get('boosterQueue').shift().toJS();
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
    firebase.push(`collections/${collection}/cards`, card);
    firebase.set(`seats/${seatId}/pickIndex`, pickIndex + 1);
    firebase.set(`seats/${seatId}/boosterQueue`, boosterQueue);
  }

  render() {
    const { set, seat, seatId } = this.props;
    if (!seat) {
      return null;
    }
    const boosterId = seat.getIn(['boosterQueue', 0]);
    console.log(boosterId);

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
