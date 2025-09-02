import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;

    if (originalConfig.url !== '/auth/login' && err.response) {
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        
        return Promise.reject(err);
      }
    }

    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/updateprofile', userData),
  changePassword: (passwordData) => api.put('/auth/changepassword', passwordData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
};

export const eventsAPI = {
  createEvent: (eventData) => api.post('/events', eventData),
  getMyEvents: (params) => api.get('/events/my-events', { params }),
  getEvent: (id) => api.get(`/events/${id}`),
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  submitFeedback: (id, feedback) => api.post(`/events/${id}/feedback`, feedback),
};

export const adminAPI = {
  getPendingEvents: (params) => api.get('/admin/pending-events', { params }),
  getAllEvents: (params) => api.get('/admin/events', { params }),
  approveEvent: (id, notes) => api.put(`/admin/events/${id}/approve`, { notes }),
  denyEvent: (id, reason) => api.put(`/admin/events/${id}/deny`, { reason }),
  completeEvent: (id) => api.put(`/admin/events/${id}/complete`),
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
  getUsers: (params) => api.get('/admin/users', { params }),
};

export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updatePreferences: (preferences) => api.put('/users/preferences', { preferences }),
  getUserStats: () => api.get('/users/stats'),
};

export const notificationsAPI = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

export default api;
