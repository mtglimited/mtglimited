import React, { PropTypes } from 'react';

const propTypes = {
  children: PropTypes.element,
};

const style = {
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
};

const Draft = ({ children }) => (
  <div style={style}>
    <h1>Draft Home</h1>
    { children }
  </div>
);

Draft.propTypes = propTypes;

export default Draft;
