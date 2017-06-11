import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

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
export default class Booster extends React.Component {
  static propTypes = {
    pickCard: PropTypes.func.isRequired,
    booster: PropTypes.shape({
      set: PropTypes.string,
      cards: PropTypes.array.isRequired,
    }).isRequired,
  };

  render() {
    const { booster, pickCard } = this.props;

    return (
      <div style={style.booster}>
        {booster.cards.map((card, index) => !card.isPicked &&
          <img
            alt={card.imageName}
            style={style.card}
            src={`http://mtglimited.io/assets/img/cards/${booster.set}/${card.imageName}.jpeg`}
            key={card.imageName}
            onTouchTap={() => pickCard(index)}
          />,
        )}
      </div>
    );
  }
}
