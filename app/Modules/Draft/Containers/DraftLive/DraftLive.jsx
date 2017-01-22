import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import DraftActions, { initializePlayers } from 'State/PlayersRedux';
import Booster from 'Modules/Draft/Components/Booster';
import style from './DraftLive.style';

const propTypes = {
  initializePlayers: PropTypes.func.isRequired,
  params: PropTypes.shape({
    activeSet: PropTypes.string,
  }),
  players: PropTypes.array.isRequired,
  pickCard: PropTypes.func.isRequired,
};

class DraftLive extends Component {
  componentDidMount() {
    const { activeSet } = this.props.params;
    this.props.initializePlayers(activeSet);
  }

  render() {
    const { booster } = this.props.players[0];
    const { pickCard } = this.props;

    return (
      <div style={style}>
        <h1>Draft Practice</h1>
        <Booster booster={booster} pickCard={pickCard} />
      </div>
    );
  }
}

DraftLive.propTypes = propTypes;

const mapStateToProps = state => ({
  sets: state.sets.toJS(),
  players: state.players.toJS(),
});

const mapDispatchToProps = dispatch => ({
  initializePlayers: set => dispatch(initializePlayers(set)),
  pickCard: (cardIndex, playerIndex) => {
    dispatch(DraftActions.pickCard(cardIndex, playerIndex));
    // dispatch(DraftActions.pickAIPlayerCards());
    // dispatch(DraftActions.passPacks());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DraftLive);
