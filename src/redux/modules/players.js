/**
** Actions to track the iframe players.

  players: { // readyPlayers + failedPlayerCount => state.videoList.length
    readyPlayers: [ all ready players ]
    activePlayer: index in readyPlayers currently player,
    failedPlayerCount: number of failed players,
    allReady: bool,
  }
**/

import { createAction, handleActions } from 'redux-actions'
import { addToArray } from '../utils/helpers'

// ------------------------------------
// Constants - Action Types
// ------------------------------------
export const ADD_PLAYER_READY = 'ADD_PLAYER_READY'
export const ADD_PLAYER_FAILED = 'ADD_PLAYER_FAILED'
export const SET_ACTIVE_PLAYER = 'SET_ACTIVE_PLAYER'
export const SET_ALL_READY = 'SET_ALL_READY'
export const RESET_PLAYERS = 'RESET_PLAYERS'

// ------------------------------------
// Public API - Action Creators and getters
// ------------------------------------
export const addReadyPlayer = createAction(ADD_PLAYER_READY, player => player)
export const addFailedPlayer = createAction(ADD_PLAYER_FAILED, numFailed => numFailed)
export const setActivePlayer = createAction(SET_ACTIVE_PLAYER, player => player)
export const setAllReady = createAction(SET_ALL_READY, allReady => allReady)
export const resetPlayers = createAction(RESET_PLAYERS, () => true)

export const actionCreators = {
  addReadyPlayer,
  addFailedPlayer,
  setActivePlayer,
  setAllReady,
  resetPlayers
}

// ------------------------------------
// Reducer - handles multiple action types
// ------------------------------------
export default handleActions({
  ADD_PLAYER_READY: (state, { payload }) => {
    return {
      ...state,
      readyPlayers: addToArray(state.readyPlayers, payload)
    }
  },
  ADD_PLAYER_FAILED: (state, { payload }) => {
    return {
      ...state,
      // failedPlayers: addToArray(state.failedPlayers, payload),
      failedPlayerCount: state.failedPlayerCount + payload
    }
  },
  SET_ACTIVE_PLAYER: (state, { payload }) => {
    return {
      ...state,
      activePlayer: payload
    }
  },
  SET_ALL_READY: (state, { payload }) => {
    return {
      ...state,
      allReady: payload
    }
  },
  RESET_PLAYERS: (state, { payload }) => {
    return {
      readyPlayers: [],
      failedPlayerCount: 0,
      allReady: false,
      activePlayer: null
    }
  }
}, {
  readyPlayers: [],
  failedPlayerCount: 0,
  allReady: false,
  activePlayer: null
})
