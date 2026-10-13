import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ecoconnect_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, clear token
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        localStorage.removeItem('ecoconnect_token');
        localStorage.removeItem('ecoconnect_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Requests Services
export const requestService = {
  create: (data) => api.post('/requests', data),
  getMyRequests: () => api.get('/requests/my'),
  getById: (id) => api.get(`/requests/${id}`),
  cancel: (id, reason) => api.patch(`/requests/${id}/cancel`, { reason })
};

// Recycler Services
export const recyclerService = {
  getAll: (params) => api.get('/recyclers', { params }),
  getById: (id) => api.get(`/recyclers/${id}`),
  registerProfile: (data) => api.post('/recyclers/register', data),
  getMyProfile: () => api.get('/recyclers/profile/me'),
  updateAvailability: (id, data) => api.patch(`/recyclers/${id}/availability`, data),
  getRecyclerRequests: (params) => api.get('/recyclers/requests/all', { params }),
  updateRequestStatus: (id, data) => api.patch(`/recyclers/requests/${id}/status`, data)
};

// Pickup Spots Services
export const pickupSpotService = {
  getAll: (params) => api.get('/pickup-spots', { params }),
  getById: (id) => api.get(`/pickup-spots/${id}`),
  create: (data) => api.post('/pickup-spots', data),
  update: (id, data) => api.patch(`/pickup-spots/${id}`, data),
  delete: (id) => api.delete(`/pickup-spots/${id}`)
};

// Admin Services
export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getRecyclers: (params) => api.get('/admin/recyclers', { params }),
  verifyRecycler: (id, data) => api.patch(`/admin/recyclers/${id}/verify`, data),
  getAllRequests: (params) => api.get('/admin/requests', { params }),
  getRecords: (params) => api.get('/admin/records', { params }),
  getAnalytics: () => api.get('/admin/analytics'),
  getSurveyAnalytics: () => api.get('/survey/analytics'),
  getSurveyResponses: () => api.get('/survey/all')
};

// Survey Services
export const surveyService = {
  submit: (data) => api.post('/survey', data)
};

export default api;
