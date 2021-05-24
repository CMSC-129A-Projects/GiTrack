import axios from 'axios';

export const BASE_URL = '/github';

const GithubService = {
  repos: () => axios.get(`${BASE_URL}/repos`),
  branches: ({ repoId }) => axios.get(`${BASE_URL}/${repoId}/branches`),
  link: () => axios.get(`${BASE_URL}/link`),
  status: () => axios.get(`${BASE_URL}/token-status`),
  callback: ({ params }) => axios.get(`${BASE_URL}/link/callback`, { params }),
};

export default GithubService;
