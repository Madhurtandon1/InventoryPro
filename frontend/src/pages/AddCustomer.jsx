import React, { useState } from "react";
import axios from "../utils/axios.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddCustomer = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Customer name is required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post("/customers", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Customer added successfully!");
      navigate("/customers");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add customer");
    }
  };

  return (
 <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-lg shadow mt-6">
  <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
    ➕ Add New Customer
  </h2>

  <form
    onSubmit={handleSubmit}
    className="grid grid-cols-1 md:grid-cols-2 gap-6"
  >
    {/* Name Field */}
    <div>
      <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
        Name <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="name"
        placeholder="e.g., John Doe"
        value={form.name}
        onChange={handleChange}
              className="w-full border rounded px-4 py-2 dark:text-white dark:bg-gray-800"
        required
      />
    </div>

    {/* Phone Field */}
    <div>
      <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
        Phone
      </label>
      <input
        type="text"
        name="phone"
        placeholder="e.g., 9876543210"
        value={form.phone}
        onChange={handleChange}
              className="w-full border rounded px-4 py-2 dark:text-white dark:bg-gray-800"
      />
    </div>

    {/* Email Field */}
    <div>
      <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
        Email
      </label>
      <input
        type="email"
        name="email"
        placeholder="e.g., john@example.com"
        value={form.email}
        onChange={handleChange}
              className="w-full border rounded px-4 py-2 dark:text-white dark:bg-gray-800"
      />
    </div>

    {/* Address Field */}
    <div>
      <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
        Address
      </label>
      <textarea
        name="address"
        placeholder="e.g., 123 Main Street, City, ZIP"
        value={form.address}
        onChange={handleChange}
        rows={3}
              className="w-full border rounded px-4 py-2 dark:text-white dark:bg-gray-800"
      />
    </div>

    {/* Submit Button */}
    <div className="col-span-full text-right">
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-medium"
      >
        Add Customer
      </button>
    </div>
  </form>
</div>


  );
};

export default AddCustomer;
