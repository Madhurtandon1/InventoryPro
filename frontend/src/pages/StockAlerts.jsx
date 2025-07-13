import React, { useEffect, useState } from "react";
import axios from "../utils/axios.js";
import toast from "react-hot-toast";

const StockAlerts = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLowStock = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/products/low-stock", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLowStockProducts(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch stock alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStock();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">🚨 Low Stock Alerts</h1>

      {loading ? (
        <p>Loading...</p>
      ) : lowStockProducts.length === 0 ? (
        <p className="text-green-600">All products are sufficiently stocked ✅</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border shadow">
            <thead>
              <tr className="bg-red-100 text-left">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">SKU</th>
                <th className="p-2 border">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map((product) => (
                <tr key={product._id} className="hover:bg-red-50">
                  <td className="p-2 border">{product.name}</td>
                  <td className="p-2 border">{product.sku}</td>
                  <td className="p-2 border text-red-600 font-semibold">
                    {product.quantity}
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

export default StockAlerts;
