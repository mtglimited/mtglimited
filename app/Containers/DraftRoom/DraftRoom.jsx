import React from 'react';
import * as Colyseus from 'colyseus.js';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const propTypes = {
  params: React.PropTypes.object,
};

class DraftRoom extends React.Component {
  constructor(props) {
    super(props);

    this.client = new Colyseus.Client('ws://localhost:2657');
    this.room = this.client.join('draft');

    this.handleSubmitChat = this.handleSubmitChat.bind(this);
    this.update = this.update.bind(this);
    this.startDraft = this.startDraft.bind(this);
  }

  componentDidMount() {
    this.room.onUpdate.add(() => this.update());
  }

  componentWillUnmount() {
    this.client.leave();
  }

  addMessage(message) {
    this.client.send({ message });
  }

  handleSubmitChat() {
    this.addMessage(this.chatTextInput.getValue());
  }

  update() {
    this.forceUpdate();
  }

  startDraft() {
    this.client.send({ isDraftStarted: true });
  }

  render() {
    const { messages, players, isDraftStarted } = this.room.state.data;

    return (
      <div>
        {!isDraftStarted &&
          <div>
            <h1>Draft Room {this.props.params.roomId}</h1>
            <h2>Chat log</h2>
            <ul style={{ listStyle: 'none' }}>
              {messages &&
                messages.map((message, index) => (
                  <li key={index}>{message}</li>
                ))}
            </ul>
            {players &&
              <div>
                <h2>Players ({Object.keys(players).length})</h2>
                <ul style={{ listStyle: 'none' }}>
                  {Object.keys(players).map((player, index) => (
                    <li key={index}>{player}</li>
                  ))}
                </ul>
              </div>
            }
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <TextField
                ref={(element) => { this.chatTextInput = element; }}
                hintText="Enter chat here"
              />
              <RaisedButton
                style={{ marginBottom: '10px' }}
                label="Submit"
                onTouchTap={this.handleSubmitChat}
              />
              {players && Object.keys(players).length > 1 &&
                <RaisedButton
                  label="Start Draft"
                  onTouchTap={this.startDraft}
                />
              }
            </div>
          </div>
        }
        {isDraftStarted &&
          <h1>Live Draft</h1>
        }
      </div>
    );
  }
}

DraftRoom.propTypes = propTypes;

export default DraftRoom;
