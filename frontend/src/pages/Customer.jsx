import React, { useEffect, useState } from "react";
import axios from "../utils/axios.js";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Customers = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { user } = useAuth();

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", address: "" });
  const [recentDays, setRecentDays] = useState(7);

  const [showModal, setShowModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("/customers", {
        headers: { Authorization: `Bearer ${token}` },
        params: search ? { search } : {},
      });
      setCustomers(res.data.data.customers);
    } catch {
      toast.error("❌ Failed to fetch customers");
    }
  };

  const getTopCustomers = async () => {
    try {
      const res = await axios.get("/customers/analytics/top", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(res.data.data);
    } catch {
      toast.error("❌ Failed to fetch top customers");
    }
  };

  const getRecentCustomers = async () => {
    try {
      const res = await axios.get(`/customers/analytics/recent?days=${recentDays}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(res.data.data);
    } catch {
      toast.error("❌ Failed to fetch recent customers");
    }
  };

  const getCustomersWithoutOrders = async () => {
    try {
      const res = await axios.get("/customers/analytics/no-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(res.data.data);
    } catch {
      toast.error("❌ Failed to fetch customers without orders");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const handleEdit = (cust) => {
    setEditingCustomer(cust._id);
    setFormData({ name: cust.name, phone: cust.phone, email: cust.email, address: cust.address });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/customers/${editingCustomer}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ Customer updated successfully");
      setEditingCustomer(null);
      fetchCustomers();
    } catch {
      toast.error("❌ Update failed");
    }
  };

  const confirmDelete = (cust) => {
    setCustomerToDelete(cust);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/customers/${customerToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🗑️ Customer deleted successfully");
      setShowModal(false);
      setCustomerToDelete(null);
      fetchCustomers();
    } catch {
      toast.error("❌ Delete failed");
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">👥 Customers</h1>
        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/customers/add")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Add Customer
          </button>
        )}
      </div>

      {/* Filter & Analytics Buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="🔍 Search customers by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded dark:bg-gray-800 dark:text-white"
        />
        <button onClick={getTopCustomers} className="bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700">Top Customers</button>
        <div className="flex items-center gap-1">
          <input
            type="number"
            min="1"
            value={recentDays}
            onChange={(e) => setRecentDays(e.target.value)}
            className="border px-2 py-1 rounded w-20 bg-gray-800 text-white"
          />
          <button onClick={getRecentCustomers} className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">Recent</button>
        </div>
        <button onClick={getCustomersWithoutOrders} className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700">No Orders</button>
        <button onClick={fetchCustomers} className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700">Reset</button>
      </div>

      {/* Customer Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border text-sm text-gray-800 dark:text-gray-600">
          <thead className="bg-gray-200 dark:bg-gray-400 text-left">
            <tr>
              <th className="px-4 py-2 border">Customer ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Address</th>
              {user?.role === "admin" && <th className="px-4 py-2 border">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {customers.map((cust) =>
              editingCustomer === cust._id ? (
                <tr key={cust._id} className="bg-yellow-50 dark:bg-gray-100">
                  <td className="px-2 py-1 border">{cust.customerId}</td>
                  <td className="px-2 py-1 border">
                    <input name="name" value={formData.name} onChange={handleChange} className="border px-2 py-1 w-full" />
                  </td>
                  <td className="px-2 py-1 border">
                    <input name="phone" value={formData.phone} onChange={handleChange} className="border px-2 py-1 w-full" />
                  </td>
                  <td className="px-2 py-1 border">
                    <input name="email" value={formData.email} onChange={handleChange} className="border px-2 py-1 w-full" />
                  </td>
                  <td className="px-2 py-1 border">
                    <input name="address" value={formData.address} onChange={handleChange} className="border px-2 py-1 w-full" />
                  </td>
                  <td className="px-2 py-1 border whitespace-nowrap">
                    <button onClick={handleUpdate} className="bg-green-600 text-white px-2 py-1 rounded mr-2">Save</button>
                    <button onClick={() => setEditingCustomer(null)} className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr key={cust._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-2 border">{cust.customerId}</td>
                  <td className="px-4 py-2 border">{cust.name}</td>
                  <td className="px-4 py-2 border">{cust.phone}</td>
                  <td className="px-4 py-2 border">{cust.email}</td>
                  <td className="px-4 py-2 border">{cust.address}</td>
                  {user?.role === "admin" && (
                    <td className="px-4 py-2 border whitespace-nowrap">
                      <button onClick={() => handleEdit(cust)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                      <button onClick={() => confirmDelete(cust)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                    </td>
                  )}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Confirm Deletion
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete <strong>{customerToDelete?.name}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
