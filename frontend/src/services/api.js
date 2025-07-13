// src/services/api.js
import axios from "../utils/axios.js";
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // needed for secure cookies (JWT)
});

export default api;
