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

import Drawer from 'Containers/Drawer';
import * as DrawerActions from 'State/DrawerRedux';

const style = {
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  overflow: 'scroll',
  drawer: {
    header: {
      margin: 15,
    },
  },
};

@firebaseConnect()
@connect(state => ({
  profile: state.firebase.get('profile'),
}))
export default class UniversalLayout extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    dispatch: PropTypes.func.isRequired,
    firebase: PropTypes.shape().isRequired,
    profile: PropTypes.shape(),
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
      <h3 style={style.drawer.header}>Navigation</h3>
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
    const { profile } = this.props;
    const { profilePopoverIsOpen } = this.state;

    return (
      <div style={style}>
        <AppBar
          title="MTGLIMITED"
          onTitleTouchTap={() => browserHistory.push('/')}
          iconElementLeft={this.menuButton}
          titleStyle={{ cursor: 'pointer' }}
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
                <Avatar
                  src={profile.get('avatarUrl')}
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
                  <span>{profile.get('displayName')}</span>
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
