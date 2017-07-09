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
    firebase.set(`seats/${seatId}/boosterQueue`, boosterQueue);
    firebase.set(`seats/${seatId}/pickIndex`, pickIndex + 1);
    firebase.set(`boosters/${boosterId}/cards/${index}/pickIndex`, pickIndex);
    firebase.set(`boosters/${boosterId}/cards/${index}/owner`, uid);

    let collection = seat.get('collection');

    // TODO: move this to when draft starts
    // Do logic for each seat
    if (!collection) {
      const collectionRef = await firebase.push('collections', {
        owner: uid,
      });
      collection = collectionRef.key;
      firebase.set(`seats/${seatId}/collection`, collection);
    }

    firebase.push(`collections/${collection}/cards`, card);
  }

  render() {
    const { set, seat, seatId } = this.props;
    if (!seat) {
      return null;
    }
    const boosterId = seat.getIn(['boosterQueue', 0]);

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
