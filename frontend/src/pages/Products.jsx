import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../utils/axios.js";
import { Toaster, toast } from "react-hot-toast";

const Products = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isLowStockView = queryParams.get("lowStock") === "true";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategories, setShowCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    description: "",
    supplier: "",
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/products/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const params = {};
      if (isLowStockView) params.lowStock = true;
      if (selectedCategory) params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;

      const res = await axios.get("/products", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setProducts(res.data.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [location.search, selectedCategory, searchTerm]);

  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
      description: product.description,
      supplier: product.supplier || "",
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/products/${editingProduct}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ Product updated successfully!");
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error("Update failed", err);
      toast.error("❌ Failed to update product");
    }
  };

  const confirmDelete = (id) => {
    setSelectedProductId(id);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/products/${selectedProductId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🗑️ Product deleted successfully!");
      setShowConfirmModal(false);
      setSelectedProductId(null);
      fetchProducts();
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("❌ Failed to delete product");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          📦 Product List {isLowStockView && "(Low Stock)"} {selectedCategory && `- ${selectedCategory}`}
        </h1>
        <button
          onClick={() => navigate("/products/add")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          ➕ Add Product
        </button>
      </div>

      {/* Category Toggle */}
      <div className="mb-4">
        <button
          onClick={() => setShowCategories(!showCategories)}
          className="bg-gray-300 px-3 py-1 rounded"
        >
          {showCategories ? "Hide Categories" : "Show Categories"}
        </button>
      </div>

      {/* Category Buttons */}
      {showCategories && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 rounded text-sm ${
              selectedCategory === null
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-3 py-1 rounded text-sm ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search by name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border px-4 py-2 rounded shadow bg-gray-800"
        />
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border text-sm text-gray-800 dark:text-gray-600">
          <thead className="bg-gray-200 dark:bg-gray-400 text-left">
            <tr>
              <th className="px-4 py-2 border">SKU</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Qty</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) =>
              editingProduct === prod._id ? (
                <tr key={prod._id} className="bg-yellow-100 dark:bg-gray-100">
                  <td className="px-2 py-1 border">{prod.sku}</td>
                  <td className="px-2 py-1 border">
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="border px-2 py-1 w-full rounded"
                    />
                  </td>
                  <td className="px-2 py-1 border">
                    <input
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      type="number"
                      className="border px-2 py-1 w-full rounded"
                    />
                  </td>
                  <td className="px-2 py-1 border">
                    <input
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      type="number"
                      className="border px-2 py-1 w-full rounded"
                    />
                  </td>
                  <td className="px-2 py-1 border">
                    <input
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="border px-2 py-1 w-full rounded"
                    />
                  </td>
                  <td className="px-2 py-1 border space-x-2">
                    <button
                      onClick={handleUpdate}
                      className="bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="bg-gray-500 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={prod._id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                  <td className="px-4 py-2 border">{prod.sku}</td>
                  <td className="px-4 py-2 border">{prod.name}</td>
                  <td className="px-4 py-2 border">₹{prod.price}</td>
                  <td className="px-4 py-2 border">{prod.quantity}</td>
                  <td className="px-4 py-2 border">{prod.category}</td>
                  <td className="px-4 py-2 border space-x-2">
                    <button
                      onClick={() => handleEdit(prod)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(prod._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete this product?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
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

export default Products;
