import React, { useEffect, useState } from "react";
import axios from "../utils/axios.js";
import toast from "react-hot-toast";

const SalesReport = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/orders/sales-summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSales(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch sales report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">📈 Daily Sales Report</h1>

      {loading ? (
        <p>Loading...</p>
      ) : sales.length === 0 ? (
        <p>No sales data available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border shadow">
            <thead>
              <tr className="bg-blue-100 text-left">
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Total Orders</th>
                <th className="p-2 border">Total Sales (₹)</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((item) => (
                <tr key={item._id} className="hover:bg-blue-50">
                  <td className="p-2 border">{item._id}</td>
                  <td className="p-2 border">{item.count}</td>
                  <td className="p-2 border font-semibold text-green-700">
                    ₹{item.totalSales.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SalesReport;
