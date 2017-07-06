import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { browserHistory } from 'react-router';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import Popover from 'material-ui/Popover';
import CircularProgress from 'material-ui/CircularProgress';

import Drawer from 'Containers/Drawer';
import * as DrawerActions from 'State/DrawerRedux';

@firebaseConnect()
@connect(({ firebase: { auth } }) => ({ auth }))
export default class UniversalLayout extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    dispatch: PropTypes.func.isRequired,
    firebase: PropTypes.shape().isRequired,
    auth: PropTypes.shape(),
  };

  static defaultProps = {
    profile: null,
  };

  state = {
    profilePopoverIsOpen: false,
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

  signOut = () => {
    this.setState({ profilePopoverIsOpen: false }, this.props.firebase.logout);
  }

  navigationMenu = (
    <div>
      <h3 style={{ margin: 15 }}>Navigation</h3>
      <MenuItem
        onTouchTap={() => {
          browserHistory.push('/');
          this.props.dispatch(DrawerActions.close());
        }}
        primaryText="Lobby"
      />
      <MenuItem
        onTouchTap={() => {
          browserHistory.push('/sets');
          this.props.dispatch(DrawerActions.close());
        }}
        primaryText="Sets"
      />
    </div>
  );

  openNavigationMenu = () => {
    const { dispatch } = this.props;
    dispatch(DrawerActions.setContent(this.navigationMenu));
    dispatch(DrawerActions.open());
  }

  openProfilePopover = (event) => {
    event.preventDefault();

    this.setState({
      profilePopoverIsOpen: true,
      anchorEl: event.currentTarget,
    });
  };

  closeProfilePopover = () => {
    this.setState({ profilePopoverIsOpen: false });
  }

  menuButton = (
    <IconButton onTouchTap={this.openNavigationMenu}>
      <MenuIcon />
    </IconButton>
  );

  render() {
    const { auth } = this.props;
    const { profilePopoverIsOpen } = this.state;

    return (
      <div style={{ flexDirection: 'column', overflow: 'auto' }}>
        <AppBar
          title="MTGLIMITED"
          onTitleTouchTap={() => browserHistory.push('/')}
          iconElementLeft={this.menuButton}
          titleStyle={{ cursor: 'pointer' }}
        >
          <span style={{ margin: 'auto' }}>
            { !auth.isLoaded &&
              <CircularProgress />
            }
            { auth.isEmpty &&
              <FlatButton
                label="Sign In"
                onTouchTap={this.signIn}
              />
            }
            { !auth.isEmpty &&
              <span style={{ margin: 'auto' }}>
                <Avatar
                  src={auth.photoURL}
                  onTouchTap={this.openProfilePopover}
                  style={{ cursor: 'pointer' }}
                />
              </span>
            }
            { profilePopoverIsOpen &&
              <Popover
                open
                anchorEl={this.state.anchorEl}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                canAutoPosition
                onRequestClose={this.closeProfilePopover}

              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>{auth.displayName}</span>
                  <FlatButton
                    label="Sign Out"
                    onTouchTap={this.signOut}
                  />
                </div>
              </Popover>
            }
          </span>
        </AppBar>
        <Drawer />
        <div style={{ margin: 15, flex: 1 }}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
