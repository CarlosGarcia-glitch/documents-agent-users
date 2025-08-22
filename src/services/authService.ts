import api from './axiosInstance';

class AuthService {
  static async login(email: string, password: string) {
    const resp = await api.post('/auth/login', { email, password });
    return resp.data;
  }

  static async logout() {
    const resp = await api.post('/auth/logout');
    return resp.data;
  }

  static async registerUser({
    username,
    email,
    role,
  }: {
    username: string;
    email: string;
    role: 'USER';
  }) {
    const resp = await api.post('/auth/register', {
      username,
      email,
      role,
      password: 'User123!',
      confirm_password: 'User123!',
    });
    return resp.data;
  }

  static async registerAdmin({
    username,
    email,
    role,
  }: {
    username: string;
    email: string;
    role: 'ADMIN';
  }) {
    const resp = await api.post('/users/create', {
      username,
      email,
      role,
      password: 'Admin123!',
      confirm_password: 'Admin123!',
    });
    return resp.data;
  }

  static async getCurrentUser() {
    const resp = await api.get('/auth/me');
    return resp.data;
  }

  static async getUsers(page: number) {
    const resp = await api.get(`/users/all?page=${page}&size=10&sort=desc&order=created_at`);
    return resp.data;
  }
}

export default AuthService;
