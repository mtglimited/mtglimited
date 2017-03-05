import React from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import MenuItem from 'material-ui/MenuItem';

import Drawer from 'Containers/Drawer';
import DrawerActions from 'State/DrawerRedux';

const style = {
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  drawer: {
    header: {
      margin: '15px',
    },
  },
};

const propTypes = {
  children: React.PropTypes.element,
  dispatch: React.PropTypes.func,
};

class UniversalLayout extends React.Component {
  setDrawerContent = (content) => {
    const { dispatch } = this.props;
    dispatch(DrawerActions.setContent(content));
  };

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
    this.setDrawerContent(this.navigationMenu);
    dispatch(DrawerActions.setIsOpen(true));
  }

  render() {
    const menuButton = (
      <IconButton onTouchTap={this.openNavigationMenu}>
        <MenuIcon />
      </IconButton>
    );

    return (
      <div style={style}>
        <AppBar
          title="MTGLIMITED"
          onTitleTouchTap={() => browserHistory.push('/')}
          iconElementLeft={menuButton}
        />
        <Drawer />
        {this.props.children}
      </div>
    );
  }
}

UniversalLayout.propTypes = propTypes;

const mapStateToProps = state => ({
  drawer: state.drawer,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UniversalLayout);
