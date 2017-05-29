import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UIDrawer from 'material-ui/Drawer';

import DrawerActions from 'State/DrawerRedux';

const propTypes = {
  drawer: PropTypes.object,
  dispatch: PropTypes.func,
};

export const Drawer = ({ drawer, dispatch }) => (
  <UIDrawer
    width={200}
    open={drawer.get('isOpen')}
    docked={false}
    onRequestChange={() => dispatch(DrawerActions.setIsOpen(false))}
    {...drawer.get('props')}
  >
    {drawer.get('content')}
  </UIDrawer>
);

Drawer.propTypes = propTypes;

const mapStateToProps = state => ({
  drawer: state.drawer,
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Drawer);
