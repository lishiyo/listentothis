/**
** Actions to grab the raw video data from the API.
**/

import { createAction, handleActions } from 'redux-actions'
import mockDataHot from '../../data/snoocore-hot.json'
import mockDataTop from '../../data/snoocore-top.json'
import FILTERS from '../../data/constants'

// ------------------------------------
// Constants - Action Types
// ------------------------------------
export const DATA_FETCHED = 'DATA_FETCHED'

// ------------------------------------
// Action Creators - functions exposed as props
// ------------------------------------

// Bound action creator that automatically dispatches
// make AJAX call via snoocore here based on the filter
export const fetchVideos = createAction(DATA_FETCHED, (filter) => {
  switch (filter) {
    case FILTERS.FILTER_HOT:
      // get data, then dispatch
      return mockDataHot
    case FILTERS.FILTER_TOP:
      return mockDataTop
    default:
      return []
  }
})

export const actionCreators = {
  fetchVideos
}

// ------------------------------------
// Reducer - handles multiple action types
// ------------------------------------
export default handleActions({
  DATA_FETCHED: (state, action) => {
    return action.payload // []
  }
}, [])
