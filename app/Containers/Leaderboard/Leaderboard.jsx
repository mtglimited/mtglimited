import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { firebaseConnect } from 'react-redux-firebase';
import { fromJS } from 'immutable';

import Button from 'grommet/components/Button';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Section from 'grommet/components/Section';
import Box from 'grommet/components/Box';
import CheckBox from 'grommet/components/CheckBox';
import List from 'grommet/components/List';
import Value from 'grommet/components/Value';
import ListItem from 'grommet/components/ListItem';

@firebaseConnect(() => [
  '/users',
  '/experience',
])
@connect(state => ({
  users: state.firebase.data.users && fromJS(state.firebase.data.users),
  experience: state.firebase.data.experience && fromJS(state.firebase.data.experience)
}))
export default class Leaderboard extends React.Component {
  static propTypes = {
    firebase: PropTypes.shape().isRequired,
    users: PropTypes.shape(),
    experience: PropTypes.shape(),
  };


  render() {
    const { users, experience } = this.props;
    if (users && experience) {

      var userScores = [];
      users.forEach(function(userValue, userKey){

          var scoreTotal = 0;
          experience.forEach(function(experienceValue,experinceKey){
            if(userKey == experienceValue.get('user')){
              scoreTotal+= experienceValue.get('score');
            }
        })
          userScores.push({
            userKey: userKey,
            name:userValue.get('displayName'),
            score:scoreTotal
          });
      })

      userScores.sort(function(a, b) {
        return parseFloat(b.score) - parseFloat(a.score);
      });

      debugger;
      return (
        <div>
          <Heading strong={true}
            uppercase={false}
            truncate={false}
            align='center'>
              Leaderboard
          </Heading>
          <List>
              {userScores.map((user, key) => {
                return (
                  <ListItem key={user.userKey} onClick={() => browserHistory.push(`/users/${user.userKey}`)}>
                    <Box direction='row'
                      justify='start'
                      flex='grow'
                      align='center'
                      wrap={true}>
                      <Value value={user.name} />
                    </Box>
                    <Box direction='row'
                      justify='end'
                      align='center'
                      wrap={true}>
                      <Value value={user.score}
                        colorIndex='accent-1' />
                    </Box>
                  </ListItem>
                );
              })}
          </List>
        </div>
      );
    } else {
      return <h2>Loading...</h2>;
    }
  }
}
