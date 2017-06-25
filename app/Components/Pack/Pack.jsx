import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';

import Card from 'Components/Card';

const style = {
  display: 'flex',
};

export default class Pack extends React.Component {
  static propTypes = {
    cards: PropTypes.shape().isRequired,
    setKey: PropTypes.string.isRequired,
  }

  static defaultProps = {
    cards: Map(),
    setKey: 'AER',
  };

  constructor() {
    super();
    this.state = {
      selected: 0,
    };
  }

  nextCard = () => this.setState(prevState => ({
    selected: (prevState.selected + 1) % this.props.cards.count(),
  }));

  prevCard = () => this.setState(prevState => ({
    selected: (prevState.selected - 1) % this.props.cards.count(),
  }));

  select = selected => this.setState({
    selected,
  });

  render() {
    const { cards, setKey } = this.props;

    return (
      <div>
        <div style={{ display: 'flex' }}>
          <button onTouchTap={this.prevCard}>LEFT</button>
          <div style={style}>
            {cards.map((card, index) => (
              <Card
                setKey={setKey}
                card={card}
                select={() => this.select(index)}
                isSelected={this.state.selected === index}
              />))
            }
          </div>
          <button onTouchTap={this.nextCard}>RIGHT</button>
        </div>
        <h2>Selected: {cards.getIn([this.state.selected, 'name'])}</h2>
      </div>
    );
  }
}
