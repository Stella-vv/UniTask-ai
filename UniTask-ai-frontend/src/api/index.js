// src/api/index.js
import axios from 'axios';

const api = axios.create({
  // 后端基址：mock 或实际服务器
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api',
  withCredentials: false        // 若要携带 cookie 可改 true
});

// 如需自动带 token，可加拦截器
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;