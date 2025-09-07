import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to ensure token is always included
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Making API call:', config.method?.toUpperCase(), config.url, 'with auth:', !!token);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API request failed:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      // Token might be expired, clean it up
      localStorage.removeItem('token');
      console.log('Token expired or invalid, cleared from storage');
      // TODO: maybe redirect to login automatically?
    }
    return Promise.reject(error);
  }
);
