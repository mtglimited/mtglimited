import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { browserHistory } from 'react-router';
import Button from 'grommet/components/Button';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Tile from 'grommet/components/Tile';
import Card from 'grommet/components/Card';
import Tiles from 'grommet/components/Tiles';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Box from 'grommet/components/Box';
import Search from 'grommet/components/Search';
import Menu from 'grommet/components/Menu';
import Anchor from 'grommet/components/Anchor';
import AccessBrailleIcon from 'grommet/components/icons/base/AccessBraille';

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
        <Header>
          <Title>My Quests</Title>
          <Box flex={true}
            justify='end'
            direction='row'
            responsive={false}>
            <Search inline={true}
              fill={true}
              size='medium'
              placeHolder='Search'
              dropAlign={{"right": "right"}} />
            <Button
              primary
              onClick={() => this.createQuest()}
              label="Create Quest"
            />
            <Menu
              icon={<AccessBrailleIcon />}
              dropAlign={{"right": "right"}}
            >
              <Anchor href='#'
                className='active'>
                First
              </Anchor>
              <Anchor href='#'>
                Second
              </Anchor>
              <Anchor href='#'>
                Third
              </Anchor>
            </Menu>
          </Box>
        </Header>
        <div>
          <Tiles>
            {quests.count() === 0 &&
              <p>You have no quests. Create one now.</p>
            }
            {quests.map((quest, id) => (
              <Tile>
              <Card
                key={id} // eslint-disable-line
                thumbnail={quest.get('thumbnail')}
                label={quest.get('name')}
                onClick={() => browserHistory.push(`/quests/${id}`)} />
              </Tile>
            )).valueSeq()}
          </Tiles>
        </div>
      </div>
    );
  }
}

export default Dashboard;
