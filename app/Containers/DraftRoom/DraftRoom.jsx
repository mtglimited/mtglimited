import React from 'react';
import { connect } from 'react-redux';
import * as Colyseus from 'colyseus.js';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Booster from 'Components/Booster';
import DrawerActions from 'State/DrawerRedux';

const propTypes = {
  params: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

class DraftRoom extends React.Component {
  state = {};
  client = new Colyseus.Client('wss://localhost:2657');

  joinDraft = () => {
    const { roomId } = this.props.params;

    this.room = this.client.join(`draft/${roomId}`);
    this.room.onUpdate.add(state => this.update(state));
    this.setState(this.room.state.data);
  }

  leaveDraft = () => this.client.close();

  addMessage = message => this.client.send({ message });

  handleSubmitChat = () => this.addMessage(this.chatTextInput.getValue());

  update = state => this.setState(state);

  startDraft = () => {
    this.client.send({
      type: 'startDraft',
    });
  }

  pickCard = (cardIndex) => {
    this.client.send({
      type: 'pickCard',
      cardIndex,
    });
  }

  openConfig = () => {
    const { dispatch } = this.props;
    dispatch(DrawerActions.setProps({ openSecondary: true }));
    dispatch(DrawerActions.setIsOpen(true));
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
            {!this.room &&
              <RaisedButton
                label="Join Draft"
                onTouchTap={this.joinDraft}
              />
            }
            {this.room &&
              <RaisedButton
                label="Leave Draft"
                onTouchTap={this.leaveDraft}
              />
            }
            <RaisedButton
              label="Open Config"
              onTouchTap={this.openConfig}
            />
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
            <h1>Live Draft</h1>
            {myPlayer.currentPack &&
              <Booster
                booster={myPlayer.currentPack}
                pickCard={this.pickCard}
              />
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

export default connect(
  () => ({}),
  dispatch => ({ dispatch }),
)(DraftRoom);
