import React, { PropTypes, Component } from 'react';
import { browserHistory, Link } from 'react-router';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

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
  children: PropTypes.element,
};

class UniversalLayout extends Component {
  constructor(props) {
    super(props);
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.state = { isDrawerOpen: false };
  }

  toggleDrawer = () => this.setState({ isDrawerOpen: !this.state.isDrawerOpen });

  closeDrawer = () => this.setState({ isDrawerOpen: false });

  handleTitleTouchTap = () => browserHistory.push('/');

  render() {
    const menuButton = (
      <IconButton onTouchTap={() => this.toggleDrawer()}>
        <MenuIcon />
      </IconButton>
    );

    return (
      <div style={style}>
        <AppBar
          title="MTGLIMITED"
          onTitleTouchTap={this.handleTitleTouchTap}
          iconElementLeft={menuButton}
        />
        <Drawer
          docked={false}
          width={200}
          open={this.state.isDrawerOpen}
          onRequestChange={isDrawerOpen => this.setState({ isDrawerOpen })}
        >
          <h3 style={style.drawer.header}>Navigation</h3>
          <Link to="/draft">
            <MenuItem onTouchTap={this.closeDrawer}>Draft</MenuItem>
          </Link>
        </Drawer>
        {this.props.children}
      </div>
    );
  }
}

UniversalLayout.propTypes = propTypes;

export default UniversalLayout;
