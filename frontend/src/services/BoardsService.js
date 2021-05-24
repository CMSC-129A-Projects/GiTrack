import axios from 'axios';

export const BASE_URL = '/board';

const BoardsService = {
  create: ({ body }) => axios.post(BASE_URL, body),
  list: () => axios.get(BASE_URL),
  retrieve: ({ boardId }) => axios.get(`${BASE_URL}/${boardId}`),
  retrieveTasks: ({ boardId }) => axios.get(`${BASE_URL}/${boardId}/tasks`),
  retrieveRepos: ({ boardId }) => axios.get(`${BASE_URL}/${boardId}/repos`),
  retrieveMembers: ({ boardId }) => axios.get(`${BASE_URL}/${boardId}/members`),
  connectRepo: ({ boardId, body }) =>
    axios.post(`${BASE_URL}/${boardId}/connect`, body),
  addDevelopers: ({ boardId, body }) =>
    axios.post(`${BASE_URL}/${boardId}/add-developer`, body),
};

export default BoardsService;
