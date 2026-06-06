import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect if unauthorized (except during login)
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Let the app context know or redirect
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  googleLogin: (credential) => api.post('/auth/google', { credential }),
};

export const resumeAPI = {
  upload: (formData) => api.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getByUser: (userId) => api.get(`/resume/${userId}`),
  delete: (id) => api.delete(`/resume/${id}`),
};

export const skillAPI = {
  analyze: (payload) => api.post('/skills/analyze', payload),
  getByUser: (userId) => api.get(`/skills/${userId}`),
};

export const roadmapAPI = {
  generate: (payload) => api.post('/roadmap/generate', payload),
  getByUser: (userId) => api.get(`/roadmap/${userId}`),
  update: (payload) => api.put('/roadmap/update', payload),
};

export const interviewAPI = {
  start: (payload) => api.post('/interview/start', payload),
  submit: (payload) => api.post('/interview/submit', payload),
  getHistory: (userId) => api.get(`/interview/history/${userId}`),
};

export const progressAPI = {
  getByUser: (userId) => api.get(`/progress/${userId}`),
  update: (payload) => api.put('/progress/update', payload),
};

export default api;
