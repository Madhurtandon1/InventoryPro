import axios from "../utils/axios.js";
const API = axios.create({
  baseURL: "/api/v1/customers",
});

// Automatically attach JWT from localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 👤 Create new customer
export const createCustomer = (data) => API.post("/", data);

// 📃 Get all customers (with optional search and pagination)
export const getAllCustomers = (params) => API.get("/", { params });

// 🔍 Get customer by customerId
export const getCustomerById = (customerId) =>
  API.get(`/id/${customerId}`);

// 🔍 Get customers by name search
export const getCustomerByName = (name) =>
  API.get(`/search?name=${encodeURIComponent(name)}`);

// ✏️ Update customer
export const updateCustomer = (customerId, data) =>
  API.put(`/${customerId}`, data);

// ❌ Delete customer
export const deleteCustomer = (customerId) =>
  API.delete(`/${customerId}`);

// 📦 Get all orders of a customer
export const getOrdersByCustomer = (customerId) =>
  API.get(`/orders/${customerId}`);

// 📈 Get top customers by revenue
export const getTopCustomers = () => API.get("/top");

// 🕒 Get recent customers (e.g. last 7 days)
export const getRecentCustomers = (days = 7) =>
  API.get(`/recent?days=${days}`);

// 📊 Get total spend & orders of a customer
export const getCustomerStats = (customerId) =>
  API.get(`/stats/${customerId}`);

// 🧐 Get customers who never ordered
export const getCustomersWithoutOrders = () =>
  API.get("/without-orders");

export default {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  getCustomerByName,
  updateCustomer,
  deleteCustomer,
  getOrdersByCustomer,
  getTopCustomers,
  getRecentCustomers,
  getCustomerStats,
  getCustomersWithoutOrders,
};
