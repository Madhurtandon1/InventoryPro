import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios.js";;
import toast from "react-hot-toast";

const EditProduct = () => {
  const { id } = useParams(); // Product ID from URL
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

  const [existingImage, setExistingImage] = useState("");

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data?.data;

        setProduct({
          name: data.name,
          sku: data.sku,
          description: data.description,
          price: data.price,
          quantity: data.quantity,
          category: data.category,
          supplier: data.supplier,
          image: null,
        });
        setExistingImage(data.image);
      } catch (err) {
        toast.error("Failed to load product");
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(product).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/v1/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product updated successfully");
      navigate("/products");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update product"
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">✏️ Edit Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Product Name *</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded "
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">SKU</label>
            <input
              type="text"
              name="sku"
              value={product.sku}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Price *</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">Supplier</label>
          <input
            type="text"
            name="supplier"
            value={product.supplier}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Current Image</label>
          {existingImage ? (
            <img
              src={existingImage}
              alt="Product"
              className="w-32 h-32 object-cover rounded"
            />
          ) : (
            <p className="text-sm text-gray-500">No image available</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Replace Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
