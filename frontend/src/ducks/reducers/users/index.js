import { combineReducers } from 'redux';
import loginReducer, {
  types as loginTypes,
  actions as loginActions,
  selectors as loginSelectors,
} from './login';

const usersReducer = combineReducers({
  loginReducer,
});

export const types = {
  loginTypes,
};

export const actions = {
  loginActions,
};

export const selectors = {
  loginSelectors,
};

export default usersReducer;
