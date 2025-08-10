import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;

    if (originalConfig.url !== '/auth/login' && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        
        // Remove token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        
        return Promise.reject(err);
      }
    }

    return Promise.reject(err);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/updateprofile', userData),
  changePassword: (passwordData) => api.put('/auth/changepassword', passwordData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
};

// Events API calls
export const eventsAPI = {
  createEvent: (eventData) => api.post('/events', eventData),
  getMyEvents: (params) => api.get('/events/my-events', { params }),
  getEvent: (id) => api.get(`/events/${id}`),
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  submitFeedback: (id, feedback) => api.post(`/events/${id}/feedback`, feedback),
};

// Admin API calls
export const adminAPI = {
  getPendingEvents: (params) => api.get('/admin/pending-events', { params }),
  getAllEvents: (params) => api.get('/admin/events', { params }),
  approveEvent: (id, notes) => api.put(`/admin/events/${id}/approve`, { notes }),
  denyEvent: (id, reason) => api.put(`/admin/events/${id}/deny`, { reason }),
  completeEvent: (id) => api.put(`/admin/events/${id}/complete`),
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
  getUsers: (params) => api.get('/admin/users', { params }),
};

// Users API calls
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updatePreferences: (preferences) => api.put('/users/preferences', { preferences }),
};

export default api;
