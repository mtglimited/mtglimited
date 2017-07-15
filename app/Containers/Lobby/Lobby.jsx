import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { firebaseConnect } from 'react-redux-firebase';

import Button from 'grommet/components/Button';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import CheckBox from 'grommet/components/CheckBox';

import Rooms from 'Containers/Rooms';

const DEFAULT_SET = 'HOU';

@firebaseConnect()
@connect(({ firebase: { auth } }) => ({ auth }))
export default class Lobby extends React.Component {
  static propTypes = {
    firebase: PropTypes.shape().isRequired,
    auth: PropTypes.shape().isRequired,
  };

  state = {
    showMyRooms: false,
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
      isLive: false,
    });

    browserHistory.push(`/rooms/${ref.key}`);
  }

  render() {
    const { auth } = this.props;
    const { showMyRooms } = this.state;

    return (
      <Section pad="small">
        <Header>
          <Box flex="grow">
            <Heading>
              Lobby
            </Heading>
          </Box>
          <Box>
            { !auth.isAnonymous &&
              <Button
                primary
                label="Create New Room"
                onClick={this.createRoom}
              />
            }
            { auth.isAnonymous &&
              <p>Sign in to create a draft</p>
            }
          </Box>
        </Header>
        <CheckBox
          checked={showMyRooms}
          label="Show my Drafts"
          onChange={() => this.setState({ showMyRooms: !showMyRooms })}
        />
        <Rooms owner={auth.uid} showMyRooms={showMyRooms} />
      </Section>
    );
  }
}
