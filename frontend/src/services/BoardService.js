import axios from 'axios';

export const BASE_URL = '/board';

const BoardService = {
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
  removeMembers: ({ boardId, memberId }) =>
    axios.delete(`${BASE_URL}/${boardId}/remove-members`, {
      data: {
        member_ids: [memberId],
      },
    }),
  removeRepository: ({ boardId, repoId }) =>
    axios.delete(`${BASE_URL}/${boardId}/remove-repository`, {
      data: {
        repo_id: repoId,
      },
    }),
  removeBoard: ({ boardId }) => axios.delete(`${BASE_URL}/${boardId}`),
};

export default BoardService;
