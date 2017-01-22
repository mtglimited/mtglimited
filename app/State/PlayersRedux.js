import { createReducer, createActions } from 'reduxsauce';
import { List } from 'immutable';
import _ from 'lodash';
import { fetchSet } from './SetsRedux';
import BoosterService from './Helpers/BoosterPack/BoosterService';

const { Types, Creators } = createActions({
  setPlayers: ['players'],
  pickCard: ['cardIndex', 'playerIndex'],
  passPacks: ['direction'],
});

export const DIRECTION_LEFT = -1;
export const DIRECTION_RIGHT = 1;

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
  const players = state.toJS();
  const player = players[playerIndex];
  const card = player.booster.cards[cardIndex];
  card.isPicked = true;
  player.collection.push(card);
  player.booster.cards.splice(cardIndex, 1, card);

  return List.of(
    ...players.slice(0, playerIndex),
    player,
    ...players.slice(playerIndex + 1),
  );
};

const passPacks = (state, { direction }) => {
  const players = state.toJS();
  const firstPlayerBooster = _.clone(players[0].booster);
  const lastPlayerBooster = _.clone(players[players.length - 1].booster);
  const directionPlusMinus = direction === 'left' ? -1 : 1;
  players.forEach((player, index) => {
    /* eslint-disable no-param-reassign */
    player.booster = players[index + directionPlusMinus].booster;
  });

  if (direction === 'left') {
    players[players.length - 1].booster = firstPlayerBooster;
  } else {
    players[0].booster = lastPlayerBooster;
  }

  return List.of(...players);
};

export const reducer = createReducer(INITIAL_PLAYERS_STATE, {
  [Types.SET_PLAYERS]: setPlayers,
  [Types.PICK_CARD]: pickCard,
  [Types.PASS_PACKS]: passPacks,
});
