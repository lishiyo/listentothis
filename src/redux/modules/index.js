import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router'

// COMPONENT REDUCERS
import counter from './counter' // counter value
import tabReducer from './tabs' // current tab value
import videoReducer from './data' // current video list

// Build global state (store.getState()) from all reducers
export default combineReducers({
  counter: counter,
  router: routeReducer,
  currentTab: tabReducer,
  videoList: videoReducer
})
