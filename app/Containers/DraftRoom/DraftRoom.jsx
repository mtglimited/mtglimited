import React from 'react';
import * as Colyseus from 'colyseus.js';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Booster from 'Modules/Draft/Components/Booster';

const propTypes = {
  params: React.PropTypes.object,
};

class DraftRoom extends React.Component {
  constructor(props) {
    super(props);

    this.client = new Colyseus.Client('ws://localhost:2657');
    this.room = this.client.join('draft');
    this.state = this.room.state.data;
    this.room.onUpdate.add(state => this.update(state));

    this.handleSubmitChat = this.handleSubmitChat.bind(this);
    this.startDraft = this.startDraft.bind(this);
    this.pickCard = this.pickCard.bind(this);
    this.update = this.update.bind(this);
  }

  componentWillUnmount() {
    this.client.leave();
  }

  update(state) {
    this.setState(state);
  }

  addMessage(message) {
    this.client.send({ message });
  }

  handleSubmitChat() {
    this.addMessage(this.chatTextInput.getValue());
  }

  startDraft() {
    this.client.send({
      type: 'startDraft',
    });
  }

  pickCard(cardIndex) {
    console.log('picked ', cardIndex);
    this.client.send({
      type: 'pickCard',
      cardIndex,
    });
  }

  render() {
    const { messages, players, isDraftActive } = this.state;
    let myPlayer;
    if (players && players.length) {
      myPlayer = players.find(player => player.id === this.client.id);
    }

    return (
      <div>
        {!isDraftActive &&
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
                <h2>Players ({players.length})</h2>
                <ul style={{ listStyle: 'none' }}>
                  {players.map((player, index) => (
                    <li key={index}>{player.id}</li>
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
              {players && players.length > 1 &&
                <RaisedButton
                  label="Start Draft"
                  onTouchTap={this.startDraft}
                />
              }
            </div>
          </div>
        }
        {isDraftActive &&
          <div>
            {myPlayer.currentPack &&
              <div>
                <h1>Live Draft</h1>
                <Booster
                  booster={myPlayer.currentPack}
                  pickCard={this.pickCard}
                />
              </div>
            }
            {!myPlayer.currentPack &&
              <h2>Please wait while your neighbor picks a card</h2>
            }
          </div>
        }
      </div>
    );
  }
}

DraftRoom.propTypes = propTypes;

export default DraftRoom;
