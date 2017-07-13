import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Anchor from 'grommet/components/Anchor';

@firebaseConnect(['/availableSets'])
@connect(({ firebase }) => ({
  availableSets: firebase.data.availableSets && fromJS(firebase.data.availableSets),
}))
export default class ManageSets extends React.Component {
  static propTypes = {
    availableSets: PropTypes.shape(),
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
              key={set}
              onTouchTap={() => browserHistory.push(`/sets/${set}`)}
            >
              <Anchor path={`/${set}`}>
                {set}
              </Anchor>
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}
