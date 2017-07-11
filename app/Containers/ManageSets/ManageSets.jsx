import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { List, ListItem } from 'material-ui/List';

@firebaseConnect(['/availableSets'])
@connect(({ firebase }) => ({
  availableSets: firebase.data.availableSets && fromJS(firebase.data.availableSets),
}))
export default class ManageSets extends React.Component {
  static propTypes = {
    availableSets: PropTypes.shape().isRequired,
  };

  render() {
    const { availableSets } = this.props;
    if (!availableSets) {
      return null;
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h1>Manage Sets</h1>
        <List>
          {availableSets.map(set => (
            <ListItem
              primaryText={set}
              onTouchTap={() => browserHistory.push(`/sets/${set}`)}
            />
          ))}
        </List>
      </div>
    );
  }
}
