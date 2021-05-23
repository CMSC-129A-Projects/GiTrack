import axios from 'axios';

export const BASE_URL = '/github';

const GithubService = {
  repos: () => axios.get(`${BASE_URL}/repo`),
  link: () => axios.get(`${BASE_URL}/link`),
  callback: ({ params }) => axios.get(`${BASE_URL}/link/callback`, { params }),
};

export default GithubService;
