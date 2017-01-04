import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import styles from './UniversalLayout.styles';

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

  render() {
    const menuButton = (
      <IconButton onTouchTap={() => this.toggleDrawer()}>
        <MenuIcon />
      </IconButton>
    );

    return (
      <div style={styles}>
        <AppBar
          title="MTGLIMITED"
          iconElementLeft={menuButton}
        />
        <Drawer
          docked={false}
          width={200}
          open={this.state.isDrawerOpen}
          onRequestChange={isDrawerOpen => this.setState({ isDrawerOpen })}
        >
          <h3 style={styles.drawer.header}>Navigation</h3>
          <Link to="draft">
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
