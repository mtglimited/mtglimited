import { createReducer, createActions } from 'reduxsauce';
import { List, Map } from 'immutable';
import _ from 'lodash';
import { fetchSet } from './SetsRedux';
import BoosterService from './Helpers/BoosterPack/BoosterService';

const { Types, Creators } = createActions({
  setPlayers: ['players'],
  givePlayerBoosterPack: ['playerIndex', 'booster'],
  setActiveSet: ['set'],
  pickCard: ['cardIndex', 'playerIndex'],
});

export const initializeDraft = activeSet => (dispatch) => {
  // Set the active set
  dispatch(Creators.setActiveSet(activeSet));
  // Get the set to be drafted
  dispatch(fetchSet(activeSet)).then((set) => {
    const boosterService = new BoosterService();
    boosterService.setSet(activeSet, set.data);

    // Put 8 players at the table
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

export const INITIAL_STATE = Map({
  players: List.of([]),
  activeSet: null,
});

export const setPlayers = (state, { players }) => state.merge({
  ...state,
  players: List.of(...players),
});

export const setActiveSet = (state, { activeSet }) => state.merge({
  ...state,
  activeSet,
});

/* eslint-disable */
const pickCard = (state, { cardIndex, playerIndex }) => {
  debugger;
  const players = state.toJS().players;
  const player = players[playerIndex];
  const card = _.head(player.booster.cards.splice(cardIndex, 1));
  card.isPicked = true;
  player.collection.push(card);
  player.booster.cards.splice(cardIndex, 0, card);

  const newPlayers = [
    ...players.slice(0, playerIndex),
    player,
    ...players.slice(playerIndex + 1),
  ];

  return state.merge({
    ...state,
    players: newPlayers,
  });
}

const givePlayerBoosterPack = (state, { playerIndex, boosterPack }) => {
  console.log(playerIndex, boosterPack);
  // const players = state.get('players').toJSON();
  // const folderById = first(remove(data, folder => folder.id === folderID));
  // folderById.items = sortBy(items, item => item.label);
  // players.splice(index, 0, item);

  // return state.merge({ players });

  // return [
  //   ...state.slice(0, action.index),
  //   counterReducer(state[action.index], action),
  //   ...state.slice(action.index + 1)
  // ]
};

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_PLAYERS]: setPlayers,
  [Types.GIVE_PLAYER_BOOSTER_PACK]: givePlayerBoosterPack,
  [Types.SET_ACTIVE_SET]: setActiveSet,
  [Types.PICK_CARD]: pickCard,
});
