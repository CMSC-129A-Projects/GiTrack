/* eslint-disable camelcase */

import { combineReducers } from 'redux';

import usersReducer, {
  selectors as usersSelectors,
  types as usersTypes,
} from './reducers/users';

// -----------------------------------------------------------------------------
// ROUTER NAMES
const USERS = 'USERS';

// -----------------------------------------------------------------------------
// REDUCER
const appReducer = combineReducers({
  [USERS]: usersReducer,
});

const rootReducer = (state, action) => {
  let newState = state;
  if (action.type === usersTypes.loginTypes.LOGIN_RESTART) {
    localStorage.removeItem('persist:root');
    newState = undefined;
  }
  return appReducer(newState, action);
};
export default rootReducer;

// -----------------------------------------------------------------------------
// PUBLIC SELECTORS

// users
export const getUser = (store) => usersSelectors.loginSelectors.getUser(store[USERS]);
export const getAccessToken = (store) =>
  usersSelectors.loginSelectors.getAccessToken(store[USERS]);
export const getRefreshToken = (store) =>
  usersSelectors.loginSelectors.getRefreshToken(store[USERS]);
