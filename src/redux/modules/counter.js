import { createAction, handleActions } from 'redux-actions'

// ------------------------------------
// Constants - Action Types
// ------------------------------------
export const COUNTER_INCREMENT = 'COUNTER_INCREMENT'

// ------------------------------------
// Actions - functions exposed in props
// ------------------------------------

// increment() => always adds one { payload: 1 }
// increment(value) => always adds value { payload: value}
export const increment = createAction(COUNTER_INCREMENT, (value = 1) => value)

// This is a thunk, meaning it is a function that immediately
// returns a function for lazy evaluation. It is incredibly useful for
// creating async actions, especially when combined with redux-thunk!
// NOTE: This is solely for demonstration purposes. In a real application,
// you'd probably want to dispatch an action of COUNTER_DOUBLE and let the
// reducer take care of this logic.
export const doubleAsync = () => {
  return (dispatch, getState) => {
    setTimeout(() => {
      dispatch(increment(getState().counter))
    }, 1000)
  }
}

export const actions = {
  increment,
  doubleAsync
}

// ------------------------------------
// Reducer - handle switch ACTION_TYPES
// ------------------------------------
export default handleActions({
  [COUNTER_INCREMENT]: (state, { payload }) => state + payload
}, 1)
