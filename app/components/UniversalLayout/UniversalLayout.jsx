import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { browserHistory, Link } from 'react-router';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';

import Drawer from 'Containers/Drawer';
import DrawerActions from 'State/DrawerRedux';

const style = {
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  drawer: {
    header: {
      margin: 15,
    },
  },
};

const propTypes = {
  children: PropTypes.element,
  dispatch: PropTypes.func,
  firebase: PropTypes.object,
  profile: PropTypes.object,
};

const mapStateToProps = state => ({
  profile: state.firebase.get('profile'),
});

@firebaseConnect()
@connect(mapStateToProps)
export default class UniversalLayout extends React.Component {
  static propTypes = propTypes;

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

  signOut = () => {
    this.props.firebase.logout();
  }

  navigationMenu = (
    <div>
      <h3 style={style.drawer.header}>Navigation</h3>
      <MenuItem
        // eslint-disable-next-line jsx-a11y/anchor-has-content
        containerElement={<Link to="/draft" />}
        onTouchTap={() => this.props.dispatch(DrawerActions.setIsOpen(false))}
      >Draft</MenuItem>
    </div>
  );

  openNavigationMenu = () => {
    const { dispatch } = this.props;
    dispatch(DrawerActions.setContent(this.navigationMenu));
    dispatch(DrawerActions.setIsOpen(true));
  }

  menuButton = (
    <IconButton onTouchTap={this.openNavigationMenu}>
      <MenuIcon />
    </IconButton>
  );

  render() {
    const { profile, firebase } = this.props;
    return (
      <div style={style}>
        <AppBar
          title="MTGLIMITED"
          onTitleTouchTap={() => browserHistory.push('/')}
          iconElementLeft={this.menuButton}
        >
          <span style={{ margin: 'auto' }}>
            { !profile &&
              <FlatButton
                label="Sign In"
                onTouchTap={this.signIn}
              />
            }
            { profile &&
              <span style={{ margin: 'auto' }}>
                <Avatar src={profile.get('avatarUrl')} />
                <span>{profile.get('displayName')}</span>
                <FlatButton
                  label="Sign Out"
                  onTouchTap={() => firebase.logout()}
                />
              </span>
            }
          </span>
        </AppBar>
        <Drawer />
        {this.props.children}
      </div>
    );
  }
}
