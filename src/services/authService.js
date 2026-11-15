import api from './api';

export default {
  async login(credentials) {
    const response = await api.post('/Auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        email: response.data.email,
        role: response.data.role
      }));
    }
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/Auth/register', userData);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
};