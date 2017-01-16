import _ from 'lodash';
import Booster from './Booster';

export default class BoosterPackService {
  constructor() {
    this.sets = [];
  }

  createBooster(setAbbr) {
    const set = this.sets[setAbbr];
    const booster = new Booster();
    const setGroupedByRarity = _.groupBy(set.cards, card => _.toLower(card.rarity));
    const isMythicPack = this.isMythicRare();

    _.forEach(set.booster, (rarity) => {
      let rarityKey = rarity;

      if (_.isObject(rarity)) {
        rarityKey = isMythicPack ? 'mythic rare' : 'rare';
      }

      const cardChoices = setGroupedByRarity[rarityKey];

      if (cardChoices) {
        const randomCard = this.getRandomCard(cardChoices);

        randomCard.setAbbr = setAbbr;
        booster.cards.push(_.clone(randomCard));
      }
    });

    booster.set = setAbbr;
    return booster;
  }

  setSet(setAbbr, set) {
    this.sets[setAbbr] = set;
  }

  getSet(setAbbr) {
    return this.sets[setAbbr];
  }

  // TODO: do not add duplicate cards to a pack unless its a foil
  // Add random foils
  getRandomCard = (cards) => {
    const randomCardIndex = _.random(0, cards.length - 1);

    return cards[randomCardIndex];
  }

  isMythicRare = () => _.random(1, 8) === 1;
}
