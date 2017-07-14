import React from 'react';
import PropTypes from 'prop-types';
import { firebaseConnect, isEmpty } from 'react-redux-firebase';
import Spinning from 'grommet/components/icons/Spinning';

@firebaseConnect()
export default class GuestLogin extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    firebase: PropTypes.shape().isRequired,
    auth: PropTypes.shape().isRequired,
  };

  componentDidMount = () => this.props.firebase.auth().signInAnonymously();

  render() {
    return isEmpty(this.props.auth) ? <Spinning /> : this.props.children;
  }
}
