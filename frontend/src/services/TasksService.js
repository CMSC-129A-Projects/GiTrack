import axios from 'axios';

export const BASE_URL = '/task';

const TasksService = {
  create: ({ body }) => axios.post(BASE_URL, body),
  retrieve: ({ taskId }) => axios.get(`${BASE_URL}/${taskId}`),
  remove: ({ taskId }) => axios.delete(`${BASE_URL}/${taskId}`),
};

export default TasksService;
