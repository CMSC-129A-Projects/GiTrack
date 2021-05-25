/* eslint-disable no-undef */

export const isLocal = () => process.env.NODE_ENV === 'development';

const config = {
  API_URL: isLocal() ? 'http://localhost:3000' : 'https://api.gitrack.codes',
  BASE_URL: window.location.origin,
};

export default config;
