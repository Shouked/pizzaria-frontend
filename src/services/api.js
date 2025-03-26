import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://pizzaria-backend-e254.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptador para adicionar o token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;