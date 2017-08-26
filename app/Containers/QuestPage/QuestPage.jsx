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
    params: PropTypes.string,
    quest: PropTypes.shape(),
    firebase: PropTypes.shape(),
  };

  update = (property, value) => {
    this.props.firebase.set(`/quests/${this.props.params.id}/${property}`, value);
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
        Location: <TextInput
          id="location"
          value={quest.get('location')}
          onDOMChange={event => this.update('location', event.target.value)}
        /><br />
        Name: <TextInput
          id="location"
          value={quest.get('name')}
          onDOMChange={event => this.update('name', event.target.value)}
        />
      </div>
    );
  }
}

export default QuestPage;
