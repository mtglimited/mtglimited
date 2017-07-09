import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { firebaseConnect, populate } from 'react-redux-firebase';

const style = {
  booster: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    width: '223px',
    ':hover': {
      opacity: '0.9',
      cursor: 'pointer',
    },
  },
};

@Radium
@firebaseConnect(({ boosterId }) => [`boosters/${boosterId}`])
@connect(({ firebase }, ownProps) => ({
  booster: fromJS(populate(firebase, `boosters/${ownProps.boosterId}`)),
}))
export default class Booster extends React.Component {
  static propTypes = {
    pickCard: PropTypes.func.isRequired,
    booster: PropTypes.shape(),
    set: PropTypes.shape().isRequired,
    boosterId: PropTypes.string.isRequired,
  };

  getCardImageUrl = (set, imageName) =>
    `https://storage.googleapis.com/mtglimited-154323.appspot.com/cards/${set}/${imageName}.jpeg`;

  render() {
    const { pickCard, set, boosterId, booster } = this.props;
    if (!booster) {
      return null;
    }

    return (
      <div style={style.booster}>
        {booster.get('cards').map((card, index) => {
          const cardData = set.getIn(['hashedCards', card.get('data')]);
          return !card.get('pickIndex') && card.get('pickIndex') !== 0 && (
            <img
              alt={cardData.get('imageName')}
              style={style.card}
              src={this.getCardImageUrl(booster.get('set'), cardData.get('imageName'))}
              key={index} // eslint-disable-line
              onTouchTap={() => pickCard(boosterId, index, card.get('data'), booster.get('set'))}
            />
          );
        })}
      </div>
    );
  }
}
