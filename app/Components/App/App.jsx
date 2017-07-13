import React from 'react';
import PropTypes from 'prop-types';
import UniversalLayout from 'Components/UniversalLayout';

const propTypes = {
  children: PropTypes.element.isRequired,
};

const App = ({ children }) => (
  <UniversalLayout>
    { children }
  </UniversalLayout>
);

App.propTypes = propTypes;

export default App;
