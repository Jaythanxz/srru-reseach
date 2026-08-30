import axios from 'axios';

// Automatically detect API URL from environment variable (for Vercel -> Render) or fallback to '/api' (for local/nginx)
const rawApiUrl = import.meta.env.VITE_API_URL || '/api';
const baseURL = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

const api = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Attach JWT token if stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('srru_auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const msg = error.response.data?.message || '';
      if (error.response.status === 401 || msg.includes('โทเค็น') || msg.includes('Token') || msg.includes('หมดอายุ')) {
        // Automatically clear stale or invalid token from local storage
        localStorage.removeItem('srru_auth_token');
        localStorage.removeItem('srru_user');
      }
    }
    return Promise.reject(error.response ? error.response.data : error);
  }
);

/**
 * Helper to resolve media or PDF URLs across local and cloud environments
 */
export function getBackendBaseUrl() {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
  }
  return '';
}

export function resolveMediaUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const backendBase = getBackendBaseUrl();
  if (backendBase && path.startsWith('/')) {
    return `${backendBase}${path}`;
  }
  return path;
}

export default api;
