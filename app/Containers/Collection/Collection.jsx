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
@firebaseConnect(({ collectionId }) => [`collections/${collectionId}`])
@connect(({ firebase }, ownProps) => ({
  collection: firebase.data.collections && fromJS(firebase.data.collections[ownProps.collectionId]),
}))
export default class Collection extends React.Component {
  static propTypes = {
    collection: PropTypes.shape(),
    sets: PropTypes.shape().isRequired,
  };

  // TODO: put this base url in constants/config file
  getCardImageUrl = (set, imageName) =>
    `https://storage.googleapis.com/mtglimited-154323.appspot.com/cards/${set}/${imageName}.jpeg`;

  render() {
    const { sets, collection } = this.props;
    if (!sets || !collection || !collection.get('cards')) {
      return null;
    }

    return (
      <div style={style.booster}>
        {collection.get('cards').map((card, index) => {
          const cardData = sets.getIn([card.get('set'), 'cards', card.get('data')]);
          return (
            <img
              alt={`${card.get('data')}: ${cardData.get('imageName')}`}
              style={style.card}
              src={this.getCardImageUrl(card.get('set'), cardData.get('imageName'))}
              key={index} // eslint-disable-line
            />
          );
        })}
      </div>
    );
  }
}
