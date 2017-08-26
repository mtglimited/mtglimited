import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { browserHistory } from 'react-router';
import Button from 'grommet/components/Button';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';

@firebaseConnect(() => [
  '/quests',
])
@connect(({ firebase }) => ({
  quests: firebase.data.quests && fromJS(firebase.data.quests),
}))
class Dashboard extends React.Component {
  static propTypes = {
    quests: PropTypes.shape(),
    firebase: PropTypes.shape(),
  };

  createQuest = () => {
    this.props.firebase.push('/quests', {
      foo: 'hello',
    });
  }

  render() {
    const { quests } = this.props;
    if (!quests) {
      return <h1>LOADING</h1>;
    }
    return (
      <div>
        <Button
          primary
          onClick={() => this.createQuest()}
          label="Create Quest"
        />
        <h2>Quests I Have Created</h2>
        <List>
          {quests.count() === 0 &&
            <p>You have no quests. Create one now.</p>
          }
          {quests.map((quest, id) => (
            <ListItem
              key={id} // eslint-disable-line
              onClick={() => browserHistory.push(`/quests/${id}`)}
            >
              {quest.get('name')}
            </ListItem>
          )).valueSeq()}
        </List>
      </div>
    );
  }
}

export default Dashboard;
