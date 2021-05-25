/* eslint-disable no-undef */

export const isLocal = () => window.location.href.includes('localhost');

const config = {
  API_URL: isLocal() ? 'http://localhost:3000' : 'https://api.gitrack.codes',
  BASE_URL: window.location.origin,
};

export default config;
