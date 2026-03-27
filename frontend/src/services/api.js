import axios from 'axios';

// Base API instantiation pointing generically towards backend API gateway
const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true, // IMPORTANT: Allows cookies (refresh token) to be sent securely in HTTP requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject short-lived Access Token dynamically if mapped in LocalStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Automatically intercept 401s and attempt silent cookie-refresh algorithms once!
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Detect missing/expired access token bounce precisely.
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url === '/auth/refresh-token') {
        // Infinite loop prevention. If the refresh-token endpoint itself says 401, the user's session is dead.
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // Attempt Silent API Call to rotate HTTP-only Cookies
        const res = await api.post('/auth/refresh-token');
        const newAccessToken = res.data.token;

        // Save aggressively back to LocalStorage
        localStorage.setItem('accessToken', newAccessToken);

        // Resume payload dynamically
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        // Securely erase token tracking on total session failures
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
