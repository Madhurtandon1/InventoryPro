import React, { useEffect, useState } from "react";
import axios from "../utils/axios.js";
import { Toaster, toast } from "react-hot-toast";

const AddOrder = () => {
  const token = localStorage.getItem("token");

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [custRes, prodRes] = await Promise.all([
          axios.get("/customers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/products", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setCustomers(custRes.data.data.customers);
        setProducts(prodRes.data.data);
      } catch (err) {
        console.error("Failed to fetch customers/products", err);
        toast.error("❌ Failed to fetch customers or products.");
      }
    };

    fetchInitialData();
  }, []);

  const handleAddItem = () => {
    if (!selectedProduct || quantity < 1) return;

    const product = products.find((p) => p._id === selectedProduct);

    if (!product) {
      toast.error("❌ Selected product not found.");
      return;
    }

    const existingItem = orderItems.find((item) => item.product === selectedProduct);
    const alreadyAddedQty = existingItem ? existingItem.quantity : 0;
    const totalQty = alreadyAddedQty + quantity;

    if (totalQty > product.quantity) {
      toast.error(`❌ Only ${product.quantity} units of "${product.name}" available. You requested ${totalQty}.`);
      return;
    }

    if (existingItem) {
      setOrderItems((prev) =>
        prev.map((item) =>
          item.product === selectedProduct
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setOrderItems([...orderItems, { product: selectedProduct, quantity }]);
    }

    setSelectedProduct("");
    setQuantity(1);
  };

  const handleRemoveItem = (productId) => {
    setOrderItems(orderItems.filter((item) => item.product !== productId));
  };

  const handleSubmit = async () => {
    if (!selectedCustomer || orderItems.length === 0 || !paymentMethod) {
      toast.error("❌ Please select a customer, at least one product, and a payment method.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "/orders",
        {
          customer: selectedCustomer,
          items: orderItems,
          paymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("✅ Order created successfully!");
      setSelectedCustomer("");
      setOrderItems([]);
      setPaymentMethod("");
    } catch (err) {
      console.error("🔥 Order creation failed", err.response?.data || err.message);
      toast.error("❌ Order failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded shadow mt-6">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        🛒 Create New Order
      </h1>

      {/* Customer Selection */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
          Select Customer <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="w-full border rounded px-4 py-2 text-gray-800 dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- 👥 Choose Customer --</option>
          {customers.map((cust) => (
            <option key={cust._id} value={cust._id}>
              {cust.name} | 📞 {cust.phone} {cust.email && `| ✉️ ${cust.email}`}
            </option>
          ))}
        </select>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
          Payment Method <span className="text-red-500">*</span>
        </label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border rounded px-4 py-2 text-gray-800 dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- 💳 Choose Payment Method --</option>
          <option value="Cash">Cash</option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
        </select>
      </div>

      {/* Product and Quantity Input */}
      <div className="grid md:grid-cols-3 gap-4 items-end mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Select Product
          </label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full border rounded px-4 py-2 text-gray-800 dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- 📦 Choose Product --</option>
            {products.map((prod) => (
              <option
                key={prod._id}
                value={prod._id}
                disabled={prod.quantity <= 0}
              >
                {prod.name} | 🧮 {prod.quantity} in stock | ₹{prod.price}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Quantity
          </label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full border rounded px-4 py-2 text-gray-800 dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleAddItem}
          className="bg-blue-600 text-white w-full px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Add Item
        </button>
      </div>

      {/* Order Items Preview */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
          📦 Order Items
        </h2>
        {orderItems.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300">No products added yet.</p>
        ) : (
          <ul className="divide-y dark:divide-gray-700">
            {orderItems.map((item) => {
              const prod = products.find((p) => p._id === item.product);
              return (
                <li
                  key={item.product}
                  className="flex justify-between items-center py-2 text-gray-800 dark:text-white"
                >
                  <div>
                    <span className="font-medium">{prod?.name || "Deleted Product"}</span>{" "}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      × {item.quantity}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.product)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    ✖ Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full md:w-auto bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Creating Order..." : "✅ Submit Order"}
      </button>
    </div>
  );
};

export default AddOrder;
