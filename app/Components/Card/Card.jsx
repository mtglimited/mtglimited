import React from 'react';
import PropTypes from 'prop-types';

const getStyle = (isSelected) => {
  const defaults = {
    overflow: 'hidden',
  };
  if (isSelected) {
    return {
      ...defaults,
      borderRadius: 10,
      width: 220,
      height: 310,
      maxHeight: 'calc(100vh - 150px)',
      margin: '0 10px',
      boxShadow: '0 0 1em #f00',
    };
  }
  return {
    ...defaults,
    width: 'calc((100vw - 320px) / 14)',
    paddingTop: 30,
    height: 225,
    maxHeight: 'calc(100vh - 150px)',
  };
};

const CARD_URL = 'https://storage.googleapis.com/mtglimited-154323.appspot.com/cards';

const Card = ({ setKey, card, select, isSelected }) => {
  const imageName = card.get('imageName');
  return (
    <div style={getStyle(isSelected)} onTouchTap={select}>
      <img
        alt={imageName}
        src={`${CARD_URL}/${setKey}/${imageName}.jpeg`}
        key={imageName}
        style={{
          height: '100%',
        }}
      />
    </div>
  );
};

Card.propTypes = {
  setKey: PropTypes.string.isRequired,
  card: PropTypes.shape().isRequired,
  select: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
};

Card.defaultProps = {
  isSelected: false,
};

export default Card;
