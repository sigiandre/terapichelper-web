import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7090/api/',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el Token JWT automáticamente si el usuario ha iniciado sesión
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;