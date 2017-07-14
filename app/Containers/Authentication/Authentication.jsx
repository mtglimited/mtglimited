import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import Spinning from 'grommet/components/icons/Spinning';
import GuestLogin from './GuestLogin';

@firebaseConnect()
@connect(({ firebase: { auth } }) => ({ auth }))
export default class Authentication extends React.Component {
  static propTypes = {
    auth: PropTypes.shape(),
    children: PropTypes.element.isRequired,
  };

  render() {
    const { auth, children } = this.props;

    if (!isLoaded(auth)) {
      return <Spinning />;
    } else if (isEmpty(auth)) {
      return <GuestLogin auth={auth}>{children}</GuestLogin>;
    }

    return children;
  }
}
