import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import TextInput from 'grommet/components/TextInput';

@firebaseConnect(ownProps => [
  `/quests/${ownProps.params.id}`,
])
@connect(({ firebase }) => ({
  quest: firebase.data.quests && fromJS(firebase.data.quests).first(),
}))
class QuestPage extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    quest: PropTypes.shape(),
    firebase: PropTypes.shape(),
  };

  updateLocation = (event) => {
    this.props.firebase.push(`/quests/${this.props.id}/location`, event.target.value);
  }

  render() {
    const { quest } = this.props;
    if (!quest) {
      return <h1>LOADING</h1>;
    }
    return (
      <div>
        <h2>Quest Details Page </h2>
        <h3>Date: {quest.get('date')}</h3>
        <TextInput
          id="location"
          value={quest.get('location')}
          onDOMChange={event => this.updateLocation(event)}
        />
        <h3>Location: {quest.get('location')}</h3>
        <h3>Name: {quest.get('name')}</h3>
      </div>
    );
  }
}

export default QuestPage;
