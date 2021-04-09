export const types = {
  LOGIN_UPDATE: 'USERS/LOGIN_UPDATE',
  LOGIN_RESTART: 'USERS/LOGIN_RESTART',
};

export const initialState = {
  user: {},
  accessToken: null,
  refreshToken: null,
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN_UPDATE:
      return {
        ...state,
        user: action.payload.user || state.user,
        accessToken: action.payload.accessToken || state.accessToken,
        refreshToken: action.payload.refreshToken || state.refreshToken,
      };
    case types.LOGIN_RESTART:
      return initialState;
    default:
      return state;
  }
};

export const actions = {
  loginUpdate: ({ user, accessToken, refreshToken }) => ({
    type: types.LOGIN_UPDATE,
    payload: {
      user,
      access_token: accessToken,
      refresh_token: refreshToken,
    },
  }),
  loginRestart: () => ({
    type: types.LOGIN_RESTART,
  }),
};

export const selectors = {
  getUser: (state) => state.loginReducer.user,
  getAccessToken: (state) => state.loginReducer.accessToken,
  getRefreshToken: (state) => state.loginReducer.refreshToken,
};

export default loginReducer;
