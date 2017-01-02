import React, { PropTypes } from 'react';

const propTypes = {
  children: PropTypes.element.isRequired,
};

const UniversalLayout = ({ children }) =>
  <div>
    <h1>universal layout placeholder</h1>
    {children}
  </div>;

UniversalLayout.propTypes = propTypes;

export default UniversalLayout;
