import React from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import UniversalLayout from 'Components/UniversalLayout';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const muiTheme = getMuiTheme({
  fontFamily: '"Lato", Helvetica, Arial, sans-serif',
});

const propTypes = {
  children: PropTypes.element.isRequired,
};

const App = ({ children }) => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <UniversalLayout>
      <div style={{ fontFamily: 'Lato, Helvetica, Arial, sans-serif', flex: 1, display: 'flex', flexDirection: 'column' }}>
        { children }
      </div>
    </UniversalLayout>
  </MuiThemeProvider>
);

App.propTypes = propTypes;

export default App;
