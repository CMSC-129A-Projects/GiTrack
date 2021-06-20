const BASE_URL = "/auth";
const AuthService = {
  login: ({ body }) => axios.post(`${BASE_URL}/login`, body),
  register: ({ body }) => axios.post(`${BASE_URL}/register`, body),
  logout: ({ body }) => axios.post(`${BASE_URL}/logout`, body),
};
