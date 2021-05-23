import axios from 'axios';
import config from 'services/config';
import { actions } from 'ducks/reducers/users/login';

export const configureAxios = (store) => {
  axios.defaults.baseURL = config.API_URL;
  axios.defaults.timeout = 40000;
  axios.defaults.headers.common['Content-Type'] = 'application/json';

  // add a request interceptor to all the axios requests
  // that are going to be made in the site. The purpose
  // of this interceptor is to verify if the access token
  // is still valid and renew it if needed and possible
  axios.interceptors.request.use(
    (requestConfig) => {
      // if the current request doesn't include the config's base
      // API URL, we don't attach the access token to its authorization
      // because it means it is an API call to a 3rd party service
      if (requestConfig.baseURL !== config.API_URL) {
        return requestConfig;
      }

      // Get access token from store for every api request
      const { accessToken } = store.getState().USERS.loginReducer;
      requestConfig.headers.authorization = accessToken
        ? `Bearer ${accessToken}`
        : null;

      return requestConfig;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(null, (error) => {
    if (error.config && error.response) {
      if (error.response.status === 401) {
        // Get refresh token when 401 response status
        const { refreshToken } = store.getState().USERS.loginReducer;

        if (!refreshToken) {
          store.dispatch(actions.loginRestart());
          return;
        }
        // If the REFRESH TOKEN is still active, renew the ACCESS TOKEN and the REFRESH TOKEN
        return fetch(`${config.API_URL}/auth/refresh-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh_token: refreshToken,
          }),
        })
          .then((res) => res.json())
          .then(({ access_token }) => {
            // store the NEW ACCESS TOKEN and NEW REFRESH TOKEN to the reducer
            store.dispatch(
              actions.loginUpdate({
                accessToken: access_token,
              })
            );

            // Modify the Authorization Header using the NEW ACCESS TOKEN
            error.config.headers.authorization = access_token;
            return axios.request(error.config);
          })
          .catch(() => Promise.reject(error));
      }
    }

    return Promise.reject(error);
  });
};
