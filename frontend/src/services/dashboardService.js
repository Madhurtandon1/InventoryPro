import axios from "../utils/axios.js"; // make sure axios instance is configured here

// Fetch dashboard summary (products, orders, revenue, etc.)
export const fetchDashboardSummary = async () => {
  const response = await axios.get("/api/dashboard/summary");
  return response.data;
};

// Fetch daily sales trend (last 7 days)
export const fetchSalesTrend = async () => {
  const response = await axios.get("/api/dashboard/sales-trend");
  return response.data;
};

// Fetch top 5 selling products
export const fetchTopSellingProducts = async () => {
  const response = await axios.get("/api/dashboard/top-selling");
  return response.data;
};
