import React from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import UniversalLayout from 'Components/UniversalLayout';

const propTypes = {
  children: PropTypes.element,
};

const App = ({ children }) => (
  <MuiThemeProvider>
    <UniversalLayout>
      { children }
    </UniversalLayout>
  </MuiThemeProvider>
);

App.propTypes = propTypes;

export default App;
