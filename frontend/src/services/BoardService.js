import axios from 'axios';

export const BASE_URL = '/board';

const BoardService = {
  create: ({ body }) => axios.post(BASE_URL, body),
};

export default BoardService;
