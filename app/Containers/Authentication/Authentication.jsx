import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import { browserHistory } from 'react-router';
import Spinning from 'grommet/components/icons/Spinning';

@firebaseConnect()
@connect(({ firebase: { auth } }) => ({ auth }))
export default class Authentication extends React.Component {
  static propTypes = {
    auth: PropTypes.shape(),
    children: PropTypes.element.isRequired,
  };

  render() {
    const { auth } = this.props;

    if (!isLoaded() || !auth.isLoaded) {
      return <Spinning style={{ margin: 'auto' }} />;
    } else if (auth.isEmpty) {
      browserHistory.replace('/');
      return null;
    }

    return this.props.children;
  }
}
