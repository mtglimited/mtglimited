import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import style from './Booster.style';

const propTypes = {
  pickCard: PropTypes.func.isRequired,
  booster: PropTypes.shape({
    set: PropTypes.string,
    cards: PropTypes.array,
  }),
};


@Radium
/* eslint-disable react/prefer-stateless-function */
class Booster extends Component {
  render() {
    const { booster, pickCard } = this.props;
    return (
      <div style={style.booster}>
        {booster && booster.cards.map((card, key) => (
          <img
            style={style.card}
            src={`http://mtglimited.io/assets/img/cards/${booster.set}/${card.imageName}.jpeg`}
            key={key}
            role="presentation"
            onTouchTap={() => pickCard(key, 0)}
          />
        ))}
      </div>
    );
  }
}

Booster.propTypes = propTypes;

export default Booster;
