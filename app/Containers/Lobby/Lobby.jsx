import React from 'react';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { firebaseConnect } from 'react-redux-firebase';
import { browserHistory } from 'react-router';

import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Button from 'grommet/components/Button';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';

const DEFAULT_SET = 'HOU';

@firebaseConnect(['rooms'])
@connect(({ firebase: { auth, data: { rooms } } }) => ({ auth, rooms }))
export default class Lobby extends React.Component {
  static propTypes = {
    rooms: PropTypes.object,
    firebase: PropTypes.shape().isRequired,
    auth: PropTypes.shape().isRequired,
  };

  getName = () => Math.random().toString(36).substr(7).toUpperCase();

  createRoom = async () => {
    const { firebase, auth } = this.props;
    const owner = auth.uid;
    const name = this.getName();
    const ref = firebase.push('rooms', {
      owner,
      name,
      seats: false,
      set: DEFAULT_SET,
    });

    browserHistory.push(`/rooms/${ref.key}`);
  }

  render() {
    const { auth } = this.props;
    const rooms = fromJS(this.props.rooms || {});

    return (
      <Section pad="small">
        <Header>
          <Heading>
            Lobby
          </Heading>
          <Box
            justify="end"
            flex
            direction="row"
          >
            { !auth.isEmpty &&
            <Button
              primary
              label="Create New Room"
              onClick={this.createRoom}
            />
          }
          </Box>
        </Header>
        {rooms &&
          <List>
            {rooms.count() === 0 &&
              <p>There are no current open drafts. Create a new one!</p>
            }
            {rooms.map((room, key) => (
              <ListItem
                key={key} // eslint-disable-line
                onClick={() => browserHistory.push(`/rooms/${key}`)}
              >
                {room.get('name')}
              </ListItem>
            )).valueSeq()}
          </List>
        }
      </Section>
    );
  }
}
