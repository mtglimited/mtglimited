import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { firebaseConnect } from 'react-redux-firebase';

const style = {
  booster: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    width: '223px',
    cursor: 'pointer',
    ':hover': {
      opacity: '0.9',
    },
  },
};

@Radium
@firebaseConnect(({ boosterId }) => [
  `boosters/${boosterId}`,
])
@connect(({ firebase }, ownProps) => ({
  booster: firebase.data.boosters && fromJS(firebase.data.boosters[ownProps.boosterId]),
}))
export default class Booster extends React.Component {
  static propTypes = {
    pickCard: PropTypes.func.isRequired,
    booster: PropTypes.shape(),
    set: PropTypes.shape().isRequired,
  };

  // TODO: put this base url in constants/config file
  getCardImageUrl = (set, imageName) =>
    `https://storage.googleapis.com/mtglimited-154323.appspot.com/cards/${set}/${imageName}.jpeg`;

  render() {
    const { pickCard, set, booster } = this.props;
    if (!booster) {
      return null;
    }

    return (
      <div style={style.booster}>
        {booster.get('cards').map((card, index) => {
          const cardData = set.getIn(['cards', card.get('data')]);
          return !card.get('pickNumber') && card.get('pickNumber') !== 0 && (
            <img
              alt={`${card.get('data')}: ${cardData.get('imageName')}`}
              style={style.card}
              src={this.getCardImageUrl(booster.get('set'), cardData.get('imageName'))}
              key={index} // eslint-disable-line
              onTouchTap={() => pickCard(index)}
            />
          );
        })}
      </div>
    );
  }
}
