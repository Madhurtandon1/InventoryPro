import axios from "../utils/axios.js";
const API = axios.create({
  baseURL: "/api/v1/products",
});

// Automatically attach JWT from localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 📦 Product Functions

// Create new product (with optional image upload)
export const createProduct = (formData) =>
  API.post("/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Get all products (for logged-in user)
export const getAllProducts = () => API.get("/");

// Get product by ID (without ownership check)
export const getProductById = (id) => API.get(`/public/${id}`);

// Get product by ID (owned by user)
export const getProduct = (id) => API.get(`/${id}`);

// Update a product
export const updateProduct = (id, formData) =>
  API.put(`/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Delete a product
export const deleteProduct = (id) => API.delete(`/${id}`);

// Fetch all low stock products
export const getLowStockProducts = () => API.get("/low-stock");

// Get product categories
export const getProductCategories = () => API.get("/categories");

export default {
  createProduct,
  getAllProducts,
  getProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getProductCategories,
};
