import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import DraftActions, { initializeDraft } from 'State/DraftRedux';
import Booster from 'Modules/Draft/Components/Booster';
import style from './DraftLive.style';

const propTypes = {
  initializeDraft: PropTypes.func.isRequired,
  params: PropTypes.shape({
    activeSet: PropTypes.string,
  }),
  draft: PropTypes.shape(),
  pickCard: PropTypes.func.isRequired,
};

class DraftLive extends Component {
  componentDidMount() {
    const { activeSet } = this.props.params;
    this.props.initializeDraft(activeSet);
  }

  render() {
    const { booster } = this.props.draft.players[0];
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
  sets: state.sets,
  draft: state.draft.toJS(),
});

const mapDispatchToProps = dispatch => ({
  initializeDraft: set => dispatch(initializeDraft(set)),
  pickCard: (cardIndex, playerIndex) => dispatch(DraftActions.pickCard(cardIndex, playerIndex)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DraftLive);
