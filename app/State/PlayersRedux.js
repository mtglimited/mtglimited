import { createReducer, createActions } from 'reduxsauce';
import { List } from 'immutable';
import _ from 'lodash';
import { fetchSet } from './SetsRedux';
import BoosterService from './Helpers/BoosterPack/BoosterService';
import { PASS_DIRECTIONS } from './DraftRedux';

const { Types, Creators } = createActions({
  setPlayers: ['players'],
  pickCard: ['cardIndex', 'playerIndex'],
  passPacks: ['direction'],
  pickAiPlayerCards: [],
});
/* eslint-disable */

export const initializePlayers = activeSet => (dispatch) => {
  // Get the set to be drafted
  dispatch(fetchSet(activeSet)).then((set) => {
    const boosterService = new BoosterService();
    boosterService.setSet(activeSet, set.data);

    // Put 8 players at the table
    // TODO: Make this configurable
    const players = [];
    for (let x = 0; x < 8; x += 1) {
      const booster = boosterService.createBooster(activeSet);
      players.push({
        booster,
        isAI: true,
        collection: [],
      });
    }

    players[0].isAI = false; // user is not AI
    debugger;
    dispatch(Creators.setPlayers(players));
  });
};

export const SetTypes = Types;
export default Creators;

export const INITIAL_PLAYER_STATE = {
  booster: {
    cards: [],
  },
  collection: [],
};

export const INITIAL_PLAYERS_STATE = List.of(
  INITIAL_PLAYER_STATE,
);

export const setPlayers = (state, { players }) => List.of(...players);

const pickCard = (state, { cardIndex, playerIndex }) => {
  debugger;
  const player = state.get(playerIndex);
  const card = player.booster.cards[cardIndex];
  card.isPicked = true;
  player.collection.push(card);
  player.booster.cards.splice(cardIndex, 1, card);

  const players = [
    ...state.slice(0, playerIndex),
    player,
    ...state.slice(playerIndex + 1),
  ];
  return List.of(...players);
};

const passPacks = (state, { direction }) => {
  let players = state;
  const firstPlayerBooster = state.get(0).booster;
  const lastPlayerBooster = players.get(players.size - 1).booster;

  players.forEach((player, index) => {
    const passTarget = index + direction;
    if (passTarget > 0 && passTarget < players.size) {
      /* eslint-disable no-param-reassign */
      player.booster = players.get(passTarget).booster;
    }
  });

  if (direction === PASS_DIRECTIONS.LEFT) {
    players.get(players.size - 1).booster = firstPlayerBooster;
  } else {
    players.get(0).booster = lastPlayerBooster;
  }

  return players;
};

const pickAiPlayerCards = state => state.forEach((player) => {
  if (player.isAI) {
    const highestRatedCard = _.maxBy(player.booster.cards, card => parseFloat(card.rating));
    highestRatedCard.isPicked = true;
  }
});

export const reducer = createReducer(INITIAL_PLAYERS_STATE, {
  [Types.SET_PLAYERS]: setPlayers,
  [Types.PICK_CARD]: pickCard,
  [Types.PASS_PACKS]: passPacks,
  [Types.PICK_AI_PLAYER_CARDS]: pickAiPlayerCards,
});
