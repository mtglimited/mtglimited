import React, { PropTypes } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import UniversalLayout from 'components/UniversalLayout';

const propTypes = {
  children: PropTypes.element.isRequired,
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
