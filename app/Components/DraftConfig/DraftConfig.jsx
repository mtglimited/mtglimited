import React from 'react';
import Drawer from 'material-ui/Drawer';

class DraftConfig extends React.Component {
  state = {
    isOpen: false,
  };

  handleRequestClose = () => {
    this.setState((state, prevState) => ({
      isOpen: !prevState.isOpen,
    }));
  };

  render() {
    const { isOpen } = this.state;
    return (
      <Drawer
        width={200}
        openSecondary
        open={isOpen}
        docked={false}
        onRequestChange={this.handleRequestClose}
      >
        <h1>Draft Options</h1>
      </Drawer>
    );
  }
}

export default DraftConfig;
