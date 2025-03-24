// src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://pizzaria-backend-e254.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

export default api;
