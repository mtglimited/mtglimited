import Booster from './Booster';

export default class BoosterPackService {
  constructor(setAbbr, set) {
    this.sets = [];
    this.sets[setAbbr] = set;
  }

  createBooster(setAbbr) {
    const set = this.sets[setAbbr];
    const booster = new Booster();
    const setGroupedByRarity = set.cards.groupBy(card => card.rarity.toLowerCase());
    const isMythicPack = this.isMythicRare();

    set.booster.forEach((rarity) => {
      let rarityKey = rarity;

      if (typeof rarity === 'object') {
        rarityKey = isMythicPack ? 'mythic rare' : 'rare';
      }

      const cardChoices = setGroupedByRarity[rarityKey];

      if (cardChoices) {
        const randomCard = this.getRandomCard(cardChoices);

        randomCard.setAbbr = setAbbr;
        booster.cards.push(randomCard);
      }
    });

    booster.set = setAbbr;
    return booster;
  }

  getSet = setAbbr => this.sets[setAbbr];
  getRandomCard = cards => cards.get(Math.floor(Math.random() * Math.floor(cards.length)));
  isMythicRare = () => Math.floor(Math.random() * Math.floor(7)) === 1;
}
