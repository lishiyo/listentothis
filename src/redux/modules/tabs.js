import { createAction, handleActions } from 'redux-actions'
import FILTERS from '../../data/constants'

// ------------------------------------
// Constants - Action Types
// ------------------------------------
export const SET_CURRENT_TAB = 'SET_CURRENT_TAB'

// ------------------------------------
// Action Creators - functions exposed in props
// ------------------------------------
/**
returns {
    type: SET_CURRENT_TAB,
    payload: {
      title: 'title',
      value: 'hot'
    }
}
**/
export const setCurrentTab = createAction(SET_CURRENT_TAB, (value = FILTERS.FILTER_DEFAULT) => {
  return {
    title: 'The ' + value + ' tab',
    value: value
  }
})

export const actionCreators = {
  setCurrentTab
}

// ------------------------------------
// Reducer - handles multiple action types
// ------------------------------------
export default handleActions({
  SET_CURRENT_TAB: (state, { payload }) => ({
    ...state,
    title: payload.title, // new currentTab.title
    value: payload.value // currentTab.value
  })
}, {
  title: 'INITIAL TAB',
  value: 'INITIAL VALUE'
})
