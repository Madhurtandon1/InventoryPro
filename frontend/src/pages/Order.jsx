import React, { useEffect, useState } from "react";
import axios from "../utils/axios.js";
import { Toaster, toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const Order = () => {
  const token = localStorage.getItem("token");
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // Step 1: Update filter based on URL (e.g., ?status=Pending)
  useEffect(() => {
  const queryParams = new URLSearchParams(location.search);
  const statusFromUrl = queryParams.get("status");

  if (
    statusFromUrl &&
    ["Pending", "Completed", "Cancelled"].includes(statusFromUrl)
  ) {
    setStatusFilter(statusFromUrl);
  } else {
    setStatusFilter(""); // Default to all
  }
}, [location.search]);

useEffect(() => {
  const fetchOrdersWithUrlStatus = async () => {
    const queryParams = new URLSearchParams(location.search);
    const statusFromUrl = queryParams.get("status");

    const finalStatus = ["Pending", "Completed", "Cancelled"].includes(statusFromUrl)
      ? statusFromUrl
      : "";

    setStatusFilter(finalStatus);

    try {
      const res = await axios.get("/orders", {
        headers: { Authorization: `Bearer ${token}` },
        params: finalStatus ? { status: finalStatus } : {},
      });
      setOrders(res.data.data.orders);
    } catch (error) {
      toast.error("❌ Error fetching orders.");
    }
  };

  fetchOrdersWithUrlStatus();
}, [location.search, token]);



  const handleStatusChange = async (orderNumber, newStatus) => {
    try {
      await axios.patch(
        `/orders/${orderNumber}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Order status updated.");
      // Refetch current orders
      const updatedStatus = new URLSearchParams(location.search).get("status");
      if (updatedStatus) setStatusFilter(updatedStatus);
    } catch (err) {
      toast.error("❌ Failed to update status.");
    }
  };

  const confirmDelete = (orderId) => {
    setOrderToDelete(orderId);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    if (!orderToDelete) return;
    try {
      await axios.delete(`/orders/${orderToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🗑️ Order deleted successfully.");
      setShowConfirmModal(false);
      setOrderToDelete(null);
      const currentStatus = new URLSearchParams(location.search).get("status");
      if (currentStatus) setStatusFilter(currentStatus);
    } catch (err) {
      toast.error("❌ Failed to delete order.");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const orderMatch = order.orderNumber
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const customerMatch = order.customer?.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return orderMatch || customerMatch;
  });

  const downloadPDF = async () => {
  try {
    const response = await axios.get("/orders/export/pdf", {
  responseType: "blob",
  headers: {
    Authorization: `Bearer ${token}`, // ✅ Required
  },
});


    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "orders.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Failed to download PDF", error);
  }
};


  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🧾 Orders</h1>

      {/* 🔍 Filter + Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
        <div>
          <label htmlFor="status" className="text-sm font-medium text-gray-700 mr-2">
            Filter by status:
          </label>
          <select
            id="status"
            className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => {
              const selectedStatus = e.target.value;
              setStatusFilter(selectedStatus);
              if (selectedStatus) {
                navigate(`/orders?status=${selectedStatus}`);
              } else {
                navigate("/orders");
              }
            }}
          >
            <option value="">All</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="🔍 Search by Order No. or Customer Name"
          className="w-full md:w-1/3 px-4 py-2 border rounded focus:outline-none focus:ring-2 bg-gray-800 text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    
<div className="flex justify-end mb-4">
  <button
    onClick={downloadPDF}
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
  >
    📄 Download Orders PDF
  </button>
</div>


      {/* 📋 Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border text-sm rounded text-gray-800 dark:text-gray-600">
          <thead className="bg-gray-200 dark:bg-gray-400 text-left">
            <tr>
              <th className="border px-4 py-3">Order No.</th>
              <th className="border px-4 py-3">Customer</th>
              <th className="border px-4 py-3">Items</th>
              <th className="border px-4 py-3">Status</th>
              <th className="border px-4 py-3">Date</th>
              {user?.role === "admin" && <th className="border px-4 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{order.orderNumber}</td>
                  <td className="border px-4 py-2">
                    <div className="font-medium">{order.customer?.name || "N/A"}</div>
                    <div className="text-xs text-gray-500">{order.customer?.email}</div>
                  </td>
                  <td className="border px-4 py-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-sm">
                        • {item.product?.name || "Deleted"} × {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="border px-4 py-2">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  {user?.role === "admin" && (
                    <td className="border px-4 py-2 space-y-2">
                      <select
                        className="border px-2 py-1 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.orderNumber, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => confirmDelete(order._id)}
                        className="w-full text-red-600 hover:text-red-800 text-sm"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🧾 Confirm Delete Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Confirm Deletion
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this order? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setOrderToDelete(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
