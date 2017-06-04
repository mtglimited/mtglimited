import React from 'react';

import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import NavigationCheck from 'material-ui/svg-icons/navigation/check';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FontIcon from 'material-ui/FontIcon';
import { grey700 } from 'material-ui/styles/colors';

const propTypes = {
  name: React.PropTypes.string.isRequired,
  editingName: React.PropTypes.bool,
  setEditingName: React.PropTypes.func.isRequired,
  setName: React.PropTypes.func.isRequired,
};

class Title extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hover: false, newName: '' };
  }

  onMouseEnter = () => this.setState({ hover: true });
  onMouseLeave = () => this.setState({ hover: false });
  changeName = event => this.setState({
    newName: event.target.value,
  });

  render() {
    const { name, editingName, setEditingName, setName } = this.props;

    if (editingName) {
      return (
        <div>
          <TextField
            hintText="Visual Workflow Name"
            inputStyle={{ top: '-4px', fontSize: '18px' }}
            defaultValue={name}
            onChange={this.changeName}
          />
          <IconButton onTouchTap={() => setName(this.state.newName)}>
            <NavigationCheck color={grey700} />
          </IconButton>
          <IconButton onTouchTap={() => setEditingName(false)}>
            <NavigationClose color={grey700} />
          </IconButton>
        </div>
      );
    }

    return (
      <div
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onTouchTap={() => setEditingName(true)}
      >
        {name}
        { this.state.hover &&
          <IconButton iconStyle={{ fontSize: '18px' }}>
            <FontIcon className="icon-pencil" />
          </IconButton>
        }
      </div>
    );
  }
}

Title.propTypes = propTypes;

export default Title;
