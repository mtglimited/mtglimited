import _ from 'lodash';

export default class BoosterPack {
  constructor() {
    this.cards = [];
  }

  unpickedCards() {
    return _.filter(this.cards, card => !card.picked);
  }
}
