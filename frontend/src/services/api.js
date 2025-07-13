// src/services/api.js
// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // Send cookies for authentication (JWT)
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add a request interceptor to attach token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Global error handling (e.g. redirect on 401, log out)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: handle unauthorized errors
    if (error.response?.status === 401) {
      console.warn("Unauthorized - maybe redirect to login");
    }
    return Promise.reject(error);
  }
);

export default api;
