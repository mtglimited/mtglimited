import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import RaisedButton from 'material-ui/RaisedButton';
import { primary2Color, alternateTextColor } from 'Styles/colors';

const style = {
  background: primary2Color,
  fontWeight: 100,
  color: alternateTextColor,
  textAlign: 'center',
  padding: '4em',
  margin: '-15px -15px 15px -15px',
};

@firebaseConnect()
@connect(state => ({
  signedIn: !!state.firebase.get('profile'),
}))
export default class MainCallToAction extends React.Component {
  static propTypes = {
    signedIn: PropTypes.bool,
    firebase: PropTypes.shape().isRequired,
    createRoom: PropTypes.func.isRequired,
  };

  static defaultProps= {
    signedIn: false,
  };

  signIn = async () => {
    const { firebase } = this.props;
    await firebase.login({
      provider: 'google',
      type: 'popup',
    });

    // TODO: Remove this when there is a better way to get user id
    const user = firebase.auth().currentUser;
    firebase.set(`users/${user.uid}/uid`, firebase.auth().currentUser.uid);
  }

  render() {
    return (
      <div style={style}>
        {!this.props.signedIn &&
          <div>
            <h2>Want to draft MtG with your friends for free?</h2>
            <p>Look no further.</p>

            <RaisedButton
              label="Sign Up"
              secondary
              onTouchTap={this.signIn}
            />
          </div>
        }
        {this.props.signedIn &&
          <div>
            <RaisedButton
              label="Create New Room"
              secondary
              onTouchTap={this.props.createRoom}
            />
          </div>
        }
      </div>
    );
  }
}
