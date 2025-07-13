import React, { useEffect, useState } from "react";
import axios from "../utils/axios.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const isStaff = user?.role === "staff";

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const [summaryRes, trendRes, topRes] = await Promise.all([
        axios.get("/dashboard/summary", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/dashboard/trend", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/dashboard/top-products", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setSummary(summaryRes.data.data);
      setTrend(trendRes.data.data);
      setTopProducts(topRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  if (!summary) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 ">
        📊 Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card
          title="Products"
          value={summary.totalProducts}
          onClick={() => navigate("/products")}
        />
        <Card
          title="Customers"
          value={summary.totalCustomers}
          onClick={() => navigate("/customers")}
        />
        <Card
          title="Orders"
          value={summary.totalOrders}
          onClick={() => navigate("/orders")}
        />
        <Card
          title="Completed Orders"
          value={summary.completedOrders}
          onClick={() => navigate("/orders?status=Completed")}
        />
        <Card
          title="Pending Orders"
          value={summary.pendingOrders}
          onClick={() => navigate("/orders?status=Pending")}
        />
        <Card
          title="Cancelled Orders"
          value={summary.cancelledOrders}
          onClick={() => navigate("/orders?status=Cancelled")}
        />
        {!isStaff && (
          <Card
            title="Revenue"
            value={`₹${summary.totalRevenue}`}
            onClick={() => {}}
          />
        )}
        <Card
          title="Low Stock Items"
          value={summary.lowStockCount}
          onClick={() => navigate("/products?lowStock=true")}
        />
      </div>

      {/* 📈 Sales Trend */}
      { !isStaff && (
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-700 ">
          📈 Sales Trend (Last 7 Days)
        </h2>
        <div className="bg-white dark:bg-gray-900 p-4 rounded shadow space-y-2">
          {trend.length === 0 ? (
            <p className="text-gray-500">No recent sales</p>
          ) : (
            trend.map((day) => (
              <div key={day._id} className="flex justify-between text-sm">
                <span>{day._id}</span>
                <span>
                  Orders: {day.orderCount}, Sales: ₹{day.totalSales}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
)}
      {/* 🔥 Top Selling Products */}
      {!isStaff && (
      <section>
        <h2 className="text-xl font-semibold mb-2 text-gray-700 ">
          🔥 Top Selling Products
        </h2>
        <div className="bg-white dark:bg-gray-900 p-4 rounded shadow space-y-2">
          {topProducts.length === 0 ? (
            <p className="text-gray-500">No data available</p>
          ) : (
            topProducts.map((prod) => (
              <div
                key={prod.productId}
                className="flex justify-between text-sm"
              >
                <span>
                  {prod.name} (SKU: {prod.sku})
                </span>
                <span>Sold: {prod.totalSold}</span>
              </div>
            ))
          )}
        </div>
      </section>
      )}
    </div>
  );
};

// 📦 Reusable Card Component
const Card = ({ title, value, onClick, disabled }) => (
  <div
    onClick={disabled ? undefined : onClick}
    className={`p-4 rounded shadow text-center transition-all duration-200 ${
      disabled
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-white"
    }`}
  >
    <div className="text-sm font-medium mb-1">{title}</div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

export default Dashboard;
