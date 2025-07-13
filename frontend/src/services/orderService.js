import axios from "../utils/axios.js";
const API = axios.create({
  baseURL: "/api/v1/orders",
});

// Automatically attach JWT token to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🧾 Create a new order
export const createOrder = (data) => API.post("/", data);

// 📦 Get all orders (paginated and filtered by status)
export const getAllOrders = (params) => API.get("/", { params });

// 🔍 Get order by order number
export const getOrderByNumber = (orderNumber) =>
  API.get(`/number/${orderNumber}`);

// 📆 Filter orders by date range
export const getOrdersByDate = (params) => API.get("/by-date", { params });

// 👤 Get all orders for a customer
export const getOrdersByCustomer = (customerId) =>
  API.get(`/customer/${customerId}`);

// 📊 Get sales summary by date
export const getSalesSummary = () => API.get("/sales-summary");

// 🔁 Update order status
export const updateOrderStatus = (orderNumber, status) =>
  API.put(`/status/${orderNumber}`, { status });

export default {
  createOrder,
  getAllOrders,
  getOrderByNumber,
  getOrdersByDate,
  getOrdersByCustomer,
  getSalesSummary,
  updateOrderStatus,
};
