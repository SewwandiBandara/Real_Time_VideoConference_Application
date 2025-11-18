import axios from 'axios';
import { toast } from 'react-toastify';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
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

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.error || 'An error occurred';

      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/signin';
        toast.error('Session expired. Please login again.');
      } else if (error.response.status === 403) {
        toast.error(message);
      } else if (error.response.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error(message);
      }
    } else if (error.request) {
      // Request made but no response
      toast.error('Network error. Please check your connection.');
    } else {
      // Something else happened
      toast.error('An unexpected error occurred.');
    }
    return Promise.reject(error);
  }
);

// ============= AUTH APIs =============

export const authAPI = {
  register: async (name, email, password) => {
    const response = await apiClient.post('/register', { name, email, password });
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post('/login', { email, password });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/user');
    return response.data;
  },
};

// ============= MEETING APIs =============

export const meetingAPI = {
  createMeeting: async (meetingData) => {
    const response = await apiClient.post('/meetings', meetingData);
    return response.data;
  },

  getMeetings: async () => {
    const response = await apiClient.get('/meetings');
    return response.data;
  },

  getMeetingByRoomId: async (roomId) => {
    const response = await apiClient.get(`/meetings/${roomId}`);
    return response.data;
  },

  updateMeetingStatus: async (roomId, status) => {
    const response = await apiClient.put(`/meetings/${roomId}/status`, { status });
    return response.data;
  },

  joinMeeting: async (roomId, userId, guestName, password) => {
    const response = await apiClient.post(`/meetings/${roomId}/join`, {
      userId,
      guestName,
      password,
    });
    return response.data;
  },

  getMeetingFiles: async (roomId) => {
    const response = await apiClient.get(`/meetings/${roomId}/files`);
    return response.data;
  },
};

// ============= FILE APIs =============

export const fileAPI = {
  uploadFile: async (file, meetingId) => {
    const formData = new FormData();
    formData.append('file', file);
    if (meetingId) {
      formData.append('meetingId', meetingId);
    }

    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Upload Progress: ${percentCompleted}%`);
      },
    });
    return response.data;
  },
};

// ============= SETTINGS APIs =============

export const settingsAPI = {
  getSettings: async () => {
    const response = await apiClient.get('/settings');
    return response.data;
  },

  updateSettings: async (settings) => {
    const response = await apiClient.put('/settings', settings);
    return response.data;
  },
};

// ============= HEALTH CHECK =============

export const healthCheck = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/api/health`, {
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'error' };
  }
};

export default apiClient;
