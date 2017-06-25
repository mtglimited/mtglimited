import React from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';

import Pack from 'Components/Pack';

const DraftLive = ({ room, sets }) => {
  const setKey = room.get('set', 'AER');
  const set = sets.get(setKey, Map());
  const cards = set.get('cards', List()).take(14);

  return (
    <div>
      <Pack cards={cards} setKey={setKey} />
    </div>
  );
};

DraftLive.propTypes = {
  sets: PropTypes.shape().isRequired,
  room: PropTypes.shape().isRequired,
};

export default DraftLive;
