import React, { useState } from "react";
import axios from "../utils/axios.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    supplier: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.name || !product.price || !product.quantity || !product.image) {
      return toast.error("Please fill all required fields.");
    }

    const formData = new FormData();
    Object.entries(product).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const token = localStorage.getItem("token");
      await axios.post("/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product added successfully!");
      navigate("/products");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        ➕ Add New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 text-gray-800 dark:text-white dark:bg-gray-800"
            placeholder="E.g. Bluetooth Speaker"
            required
          />
        </div>

        {/* SKU and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              SKU<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="sku"
              value={product.sku}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 dark:text-white dark:bg-gray-800"
              placeholder="Optional - Leave blank to auto-generate"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 dark:text-white dark:bg-gray-800"
              placeholder="e.g. Electronics, Grocery"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded px-4 py-2 dark:text-white dark:bg-gray-800"
            placeholder="Short product description"
          />
        </div>

        {/* Price & Quantity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 dark:text-white dark:bg-gray-800"
              required
              placeholder="e.g. 1499"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2 dark:text-white dark:bg-gray-800"
              required
              placeholder="e.g. 10"
            />
          </div>
        </div>

        {/* Supplier */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-1">
            Supplier
          </label>
          <input
            type="text"
            name="supplier"
            value={product.supplier}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 dark:text-white dark:bg-gray-800"
            placeholder="Supplier Name (optional)"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-1">
            Product Image <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
            className="w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white border rounded px-4 py-2"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
          >
            ➕ Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
