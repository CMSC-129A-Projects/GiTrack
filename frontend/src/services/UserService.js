import axios from 'axios';

export const BASE_URL = '/user';

const UserService = {
  retrieve: ({ userId }) => axios.get(`${BASE_URL}/${userId}`),
  exists: ({ params }) => axios.get(`${BASE_URL}/exists`, { params }),
};

export default UserService;
