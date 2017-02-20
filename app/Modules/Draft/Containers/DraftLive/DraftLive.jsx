import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import PlayersActions, { initializePlayers } from 'State/PlayersRedux';
import Booster from 'Modules/Draft/Components/Booster';
import style from './DraftLive.style';

const propTypes = {
  initializePlayers: PropTypes.func.isRequired,
  params: PropTypes.shape({
    activeSet: PropTypes.string,
  }),
  currentPlayer: PropTypes.object.isRequired,
  pickCard: PropTypes.func.isRequired,
  passDirection: PropTypes.number,
};

class DraftLive extends Component {
  componentDidMount() {
    const { activeSet } = this.props.params;
    this.props.initializePlayers(activeSet);
  }

  render() {
    const { currentPlayer, pickCard, passDirection } = this.props;

    return (
      <div style={style}>
        <h1>Draft Practice</h1>
        <Booster
          booster={currentPlayer.booster}
          pickCard={pickCard}
          passDirection={passDirection}
        />
      </div>
    );
  }
}

DraftLive.propTypes = propTypes;

const mapStateToProps = state => ({
  passDirection: state.draft.get('passDirection'),
  currentPlayer: state.players.get(0),
});

const mapDispatchToProps = dispatch => ({
  initializePlayers: set => dispatch(initializePlayers(set)),
  pickCard: (cardIndex, playerIndex, passDirection) => {
    dispatch(PlayersActions.pickCard(cardIndex, playerIndex));
    // dispatch(PlayersActions.pickAiPlayerCards());
    dispatch(PlayersActions.passPacks(passDirection));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DraftLive);
