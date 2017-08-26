import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { browserHistory } from 'react-router';
import Button from 'grommet/components/Button';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import Article from 'grommet/components/Article';
import Header from 'grommet/components/Header';
import Spinning from 'grommet/components/icons/Spinning';


const style = {
  aligner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
};

@firebaseConnect(() => [
  '/quests',
])
@connect(({ firebase }) => ({
  quests: firebase.data.quests && fromJS(firebase.data.quests),
  accepts: firebase.data.accepts && fromJS(firebase.data.accepts),
}))
class Dashboard extends React.Component {
  static propTypes = {
    quests: PropTypes.shape(),
    firebase: PropTypes.shape(),
  };

  createQuest = async () => {
    const questRef = await this.props.firebase.push('/quests', {
      user: this.props.firebase.auth().currentUser.uid,
    });
    browserHistory.push(`/quests/${questRef.key}`);
  }

  render() {
    const { quests, firebase } = this.props;
    const { auth } = firebase;
    if (!quests) {
      return (
        <div
          style={style.aligner}
        >
          <div>
            <Spinning
              size="xlarge"
            />
          </div>
        </div>
      );
    }
    const createdQuests = quests.filter(quest =>
      quest.get('user') === auth().currentUser.uid);

    const acceptedQuests = quests.filter(quest =>
      quest.get('party') && quest.get('party').includes(auth().currentUser.uid));

    return (
      <Article>
        <Header>
          <h2>Quests</h2>
        </Header>
        <Tabs
          justify="start"
        >
          <Tab
            title="Created"
          >
            <div>
              <Button
                primary
                onClick={() => this.createQuest()}
                label="Create Quest"
              />
              <List>
                {createdQuests.count() === 0 &&
                  <p>You have no quests. Create one now.</p>
                }
                {createdQuests.map((quest, id) => (
                  <ListItem
                    key={id} // eslint-disable-line
                    onClick={() => browserHistory.push(`/quests/${id}`)}
                  >
                    {quest.get('name')}
                  </ListItem>
                )).valueSeq()}
              </List>
            </div>
          </Tab>
          <Tab
            title="Accepted"
          >
            <div>
              <Button
                primary
                onClick={() => this.createQuest()}
                label="Create Quest"
              />
              <List>
                {acceptedQuests.count() === 0 &&
                  <p>You have not accepted any quests!</p>
                }
                {acceptedQuests.map((quest, id) => (
                  <ListItem
                    key={id} // eslint-disable-line
                    onClick={() => browserHistory.push(`/quests/${id}`)}
                  >
                    {quest.get('name')}
                  </ListItem>
                )).valueSeq()}
              </List>
            </div>
          </Tab>
        </Tabs>
      </Article>
    );
  }
}

export default Dashboard;
