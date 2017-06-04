import Immutable from 'immutable';

export default class BoosterPack {
  constructor() {
    this.cards = new Immutable.List();
  }

  unpickedCards() {
    return this.cards.filter(card => !card.get('picked'));
  }
}
