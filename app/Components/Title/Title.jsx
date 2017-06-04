import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import NavigationCheck from 'material-ui/svg-icons/navigation/check';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import { grey700 } from 'material-ui/styles/colors';
import EditIcon from 'material-ui/svg-icons/image/edit';

class Title extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    setName: PropTypes.func.isRequired,
  };

  state = {
    hover: false,
    newName: '',
    editingName: false,
  };
  onMouseEnter = () => this.setState({ hover: true });
  onMouseLeave = () => this.setState({ hover: false });
  setEditingName = editingName => this.setState({ editingName });
  handleSetName = () => {
    this.props.setName(this.state.newName);
    this.setEditingName(false);
  };
  changeName = event => this.setState({
    newName: event.target.value,
  });

  render() {
    const { name } = this.props;
    const { editingName, hover } = this.state;

    if (editingName) {
      return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <TextField
            hintText="Draft Room Name"
            inputStyle={{ top: '-4px', fontSize: '18px' }}
            defaultValue={name}
            onChange={this.changeName}
          />
          <IconButton onTouchTap={this.handleSetName}>
            <NavigationCheck color={grey700} />
          </IconButton>
          <IconButton onTouchTap={() => this.setEditingName(false)}>
            <NavigationClose color={grey700} />
          </IconButton>
        </div>
      );
    }

    return (
      <div
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onTouchTap={() => this.setEditingName(true)}
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
        <h2>{name}</h2>
        { hover &&
          <span>
            <EditIcon color={grey700} />
          </span>
        }
      </div>
    );
  }
}

export default Title;
