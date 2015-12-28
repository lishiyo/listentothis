import React from 'react'
import ReactDOM from 'react-dom'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { syncReduxAndRouter } from 'redux-simple-router'
import routes from './routes'
import Root from './containers/Root'
import configureStore from './redux/configureStore'
// import { actions as tabActions } from './redux/modules/tabs'
// Needed for onTouchTap
// Can go away when react 1.0 release
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

const history = createBrowserHistory() // manipulates # to look like real paths

// Create Store
const initialStore = Object.assign({}, window.__INITIAL_STATE__, {
  currentTab: {
    title: 'init tab in main.js',
    value: 'init value in main.js'
  },
  videoList: []
})
const store = configureStore(initialStore)

syncReduxAndRouter(history, store, (state) => state.router)

// Render the React application to the DOM
ReactDOM.render(
  <Root history={history} routes={routes} store={store} />,
  document.getElementById('root')
)
