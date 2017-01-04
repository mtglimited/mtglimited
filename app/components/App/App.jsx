import React, { PropTypes } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import UniversalLayout from 'Components/UniversalLayout';

const propTypes = {
  children: PropTypes.element,
};

const style = {
  display: 'flex',
  flex: 1,
  margin: '15px',
};

const App = ({ children }) => (
  <MuiThemeProvider>
    <UniversalLayout>
      <div style={style}>
        { children }
      </div>
    </UniversalLayout>
  </MuiThemeProvider>
);

App.propTypes = propTypes;

export default App;
