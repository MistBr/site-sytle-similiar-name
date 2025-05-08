import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api', // agora ok
  withCredentials: true, // ESSENCIAL para sessão/cookies
});

// Adiciona interceptor de request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
