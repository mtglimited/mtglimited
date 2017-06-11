import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { firebaseConnect, populatedDataToJS } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { List, ListItem } from 'material-ui/List';

const mapStateToProps = ({ firebase }) => ({
  sets: fromJS(populatedDataToJS(firebase, 'sets')),
});

@firebaseConnect(['/sets'])
@connect(mapStateToProps)
export default class ManageSets extends React.Component {
  static propTypes = {
    sets: PropTypes.shape().isRequired,
  };

  render() {
    const { sets } = this.props;
    if (!sets) {
      return null;
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h1>Manage Sets</h1>
        <List>
          {sets.map(set => (
            <ListItem
              primaryText={set.get('name')}
              onTouchTap={() => browserHistory.push(`/sets/${set.get('code')}`)}
            />
          ))}
        </List>
      </div>
    );
  }
}
