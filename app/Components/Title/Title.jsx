import React from 'react';
import PropTypes from 'prop-types';
import Button from 'grommet/components/Button';
import TextInput from 'grommet/components/TextInput';
import CheckmarkIcon from 'grommet/components/icons/base/Checkmark';
import CloseIcon from 'grommet/components/icons/base/Close';
import Box from 'grommet/components/Box';

class Title extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    setName: PropTypes.func.isRequired,
  };

  state = {
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
    const { editingName } = this.state;

    if (editingName) {
      return (
        <Box
          flex
          direction="row"
          responsive={false}
        >
          <TextInput
            placeHolder="Draft Room Name"
            style={{ top: -4, fontSize: 18 }}
            defaultValue={name}
            onChange={this.changeName}
          />
          <Button
            icon={<CheckmarkIcon />}
            onClick={this.handleSetName}
          />
          <Button
            icon={<CloseIcon />}
            onClick={() => this.setEditingName(false)}
          />
        </Box>
      );
    }

    return (
      <Box
        flex
        direction="row"
        responsive={false}
        onClick={() => this.setEditingName(true)}
      >
        <h3>{name}</h3>
      </Box>
    );
  }
}

export default Title;
