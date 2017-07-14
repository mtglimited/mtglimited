import React from 'react';
import PropTypes from 'prop-types';
import UniversalLayout from 'Components/UniversalLayout';
import Authentication from 'Containers/Authentication';

const propTypes = {
  children: PropTypes.element.isRequired,
};

const App = ({ children }) => (
  <Authentication>
    <UniversalLayout>
      { children }
    </UniversalLayout>
  </Authentication>
);

App.propTypes = propTypes;

export default App;
