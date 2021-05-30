import axios from 'axios';

export const BASE_URL = '/task';

const TaskService = {
  create: ({ body }) => axios.post(BASE_URL, body),
  retrieve: ({ taskId }) => axios.get(`${BASE_URL}/${taskId}`),
  remove: ({ taskId }) => axios.delete(`${BASE_URL}/${taskId}`),
  assign: ({ taskId, body }) => axios.post(`${BASE_URL}/${taskId}/assign-task`, body),
  updateAssignees: ({ taskId, body }) =>
    axios.put(`${BASE_URL}/${taskId}/assign-task`, body),
  connect: ({ body, taskId }) => axios.patch(`${BASE_URL}/${taskId}/connect`, body),
};

export default TaskService;
