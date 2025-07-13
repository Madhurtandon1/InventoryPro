import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000",
  withCredentials: true, // send cookies (useful for JWT auth)
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add request interceptor to attach auth token if using localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can customize error handling here (e.g., logout on 401)
    return Promise.reject(error);
  }
);

export default axiosInstance;
