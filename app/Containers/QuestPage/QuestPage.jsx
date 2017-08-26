import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { browserHistory } from 'react-router';
import TextInput from 'grommet/components/TextInput';
import DateTime from 'grommet/components/DateTime';
import Anchor from 'grommet/components/Anchor';

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

  delete = async () => {
    await this.props.firebase.remove(`/quests/${this.props.params.id}`);
    browserHistory.push('/dashboard');
  }

  render() {
    const { quest } = this.props;
    if (!quest) {
      return <h1>LOADING</h1>;
    }
    return (
      <div>
        <h2>Quest Details Page </h2>
        Date: <DateTime
          id="date"
          name="name"
          onChange={value => this.update('date', value)}
          value={quest.get('date')}
        /><br />
        Location: <TextInput
          id="location"
          value={quest.get('location')}
          onDOMChange={event => this.update('location', event.target.value)}
        /><br />
        Name: <TextInput
          id="name"
          value={quest.get('name')}
          onDOMChange={event => this.update('name', event.target.value)}
        />
        <br />
        <Anchor
          label="Delete This Quest"
          onClick={() => this.delete()}
        />
      </div>
    );
  }
}

export default QuestPage;
