// import React, { useEffect, useState } from "react";
// import axios from "../utils/axios.js";
// import { Toaster, toast } from "react-hot-toast";

// const AddOrder = () => {
//   const token = localStorage.getItem("token");

//   const [customers, setCustomers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState("");
//   const [quantity, setQuantity] = useState(1);
//   const [orderItems, setOrderItems] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const [custRes, prodRes] = await Promise.all([
//           axios.get("/customers", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get("/products", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);
//         setCustomers(custRes.data.data.customers);
//         setProducts(
//   prodRes.data.data.products
// );
//       } catch (err) {
//         console.error("Failed to fetch customers/products", err);
//         toast.error("❌ Failed to fetch customers or products.");
//       }
//     };

//     fetchInitialData();
//   }, []);

//   const handleAddItem = () => {
//     if (!selectedProduct || quantity < 1) return;

//     const product = products.find((p) => p._id === selectedProduct);

//     if (!product) {
//       toast.error("❌ Selected product not found.");
//       return;
//     }

//     const existingItem = orderItems.find((item) => item.product === selectedProduct);
//     const alreadyAddedQty = existingItem ? existingItem.quantity : 0;
//     const totalQty = alreadyAddedQty + quantity;

//     if (totalQty > product.quantity) {
//       toast.error(`❌ Only ${product.quantity} units of "${product.name}" available. You requested ${totalQty}.`);
//       return;
//     }

//     if (existingItem) {
//       setOrderItems((prev) =>
//         prev.map((item) =>
//           item.product === selectedProduct
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         )
//       );
//     } else {
//       setOrderItems([...orderItems, { product: selectedProduct, quantity }]);
//     }

//     setSelectedProduct("");
//     setQuantity(1);
//   };

//   const handleRemoveItem = (productId) => {
//     setOrderItems(orderItems.filter((item) => item.product !== productId));
//   };

//   const handleSubmit = async () => {
//     if (!selectedCustomer || orderItems.length === 0 || !paymentMethod) {
//       toast.error("❌ Please select a customer, at least one product, and a payment method.");
//       return;
//     }

//     try {
//       setLoading(true);
//       await axios.post(
//         "/orders",
//         {
//           customer: selectedCustomer,
//           items: orderItems,
//           paymentMethod,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       toast.success("✅ Order created successfully!");
//       setSelectedCustomer("");
//       setOrderItems([]);
//       setPaymentMethod("");
//     } catch (err) {
//       console.error("🔥 Order creation failed", err.response?.data || err.message);
//       toast.error("❌ Order failed: " + (err.response?.data?.message || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded shadow mt-6">
//       <Toaster position="top-right" />
//       <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
//         🛒 Create New Order
//       </h1>

//       {/* Customer Selection */}
//       <div className="mb-4">
//         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
//           Select Customer <span className="text-red-500">*</span>
//         </label>
//         <select
//           value={selectedCustomer}
//           onChange={(e) => setSelectedCustomer(e.target.value)}
//           className="w-full border rounded px-4 py-2 text-gray-800 dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="">-- 👥 Choose Customer --</option>
//           {customers.map((cust) => (
//             <option key={cust._id} value={cust._id}>
//               {cust.name} | 📞 {cust.phone} {cust.email && `| ✉️ ${cust.email}`}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Payment Method Selection */}
//       <div className="mb-6">
//         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
//           Payment Method <span className="text-red-500">*</span>
//         </label>
//         <select
//           value={paymentMethod}
//           onChange={(e) => setPaymentMethod(e.target.value)}
//           className="w-full border rounded px-4 py-2 text-gray-800 dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="">-- 💳 Choose Payment Method --</option>
//           <option value="Cash">Cash</option>
//           <option value="UPI">UPI</option>
//           <option value="Card">Card</option>
//         </select>
//       </div>

//       {/* Product and Quantity Input */}
//       <div className="grid md:grid-cols-3 gap-4 items-end mb-6">
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
//             Select Product
//           </label>
//           <select
//             value={selectedProduct}
//             onChange={(e) => setSelectedProduct(e.target.value)}
//             className="w-full border rounded px-4 py-2 text-gray-800 dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">-- 📦 Choose Product --</option>
//             {products.map((prod) => (
//               <option
//                 key={prod._id}
//                 value={prod._id}
//                 disabled={prod.quantity <= 0}
//               >
//                 {prod.name} | 🧮 {prod.quantity} in stock | ₹{prod.price}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
//             Quantity
//           </label>
//           <input
//             type="number"
//             min={1}
//             value={quantity}
//             onChange={(e) => setQuantity(Number(e.target.value))}
//             className="w-full border rounded px-4 py-2 text-gray-800 dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <button
//           onClick={handleAddItem}
//           className="bg-blue-600 text-white w-full px-4 py-2 rounded hover:bg-blue-700"
//         >
//           ➕ Add Item
//         </button>
//       </div>

//       {/* Order Items Preview */}
//       <div className="mb-6">
//         <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
//           📦 Order Items
//         </h2>
//         {orderItems.length === 0 ? (
//           <p className="text-gray-500 dark:text-gray-300">No products added yet.</p>
//         ) : (
//           <ul className="divide-y dark:divide-gray-700">
//             {orderItems.map((item) => {
//               const prod = products.find((p) => p._id === item.product);
//               return (
//                 <li
//                   key={item.product}
//                   className="flex justify-between items-center py-2 text-gray-800 dark:text-white"
//                 >
//                   <div>
//                     <span className="font-medium">{prod?.name || "Deleted Product"}</span>{" "}
//                     <span className="text-sm text-gray-600 dark:text-gray-400">
//                       × {item.quantity}
//                     </span>
//                   </div>
//                   <button
//                     onClick={() => handleRemoveItem(item.product)}
//                     className="text-red-600 hover:underline text-sm"
//                   >
//                     ✖ Remove
//                   </button>
//                 </li>
//               );
//             })}
//           </ul>
//         )}
//       </div>

//       {/* Submit Button */}
//       <button
//         onClick={handleSubmit}
//         disabled={loading}
//         className={`w-full md:w-auto bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 ${
//           loading ? "opacity-70 cursor-not-allowed" : ""
//         }`}
//       >
//         {loading ? "Creating Order..." : "✅ Submit Order"}
//       </button>
//     </div>
//   );
// };

// export default AddOrder;






import React, { useEffect, useState } from "react";
import axios from "../utils/axios.js";
import { Toaster, toast } from "react-hot-toast";
import { FiShoppingCart, FiUser, FiCreditCard, FiPackage, FiPlus, FiTrash2, FiShoppingBag } from "react-icons/fi";

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
        setProducts(prodRes.data.data.products);
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

  // Dynamically calculate order total preview
  const runningTotal = orderItems.reduce((acc, item) => {
    const prod = products.find((p) => p._id === item.product);
    return acc + (prod ? prod.price * item.quantity : 0);
  }, 0);

  return (
    <div className="p-4 md:p-8 max-w-full mx-auto min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Toaster position="top-right" />

      {/* Header Element Group */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-200 dark:border-slate-800 gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <FiShoppingCart className="text-blue-600 dark:text-blue-500" />
            <span>Generate Checkout Order</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build multi-item transactional invoices, link client identities, and deduct warehouse stock automatically.
          </p>
        </div>
      </div>

      {/* Two-Column Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Selections and Forms */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Transaction Details
            </h2>

            {/* Customer Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FiUser className="text-slate-400" /> Target Customer <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="">-- Choose Account Profile --</option>
                {customers.map((cust) => (
                  <option key={cust._id} value={cust._id}>
                    {cust.name} (📞 {cust.phone})
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FiCreditCard className="text-slate-400" /> Settlement Ledger Method <span className="text-rose-500">*</span>
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="">-- Choose Payment Channel --</option>
                <option value="Cash">💸 Cash Settlement</option>
                <option value="UPI">📱 Instant UPI Network</option>
                <option value="Card">💳 Credit / Debit Card</option>
              </select>
            </div>
          </div>

          {/* Item Appending Matrix Container */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Append Catalog Nodes
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
              {/* Product Picker */}
              <div className="sm:col-span-3 space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <FiPackage className="text-slate-400" /> Select Product Node
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 font-medium"
                >
                  <option value="">-- Choose Catalog Entry --</option>
                  {products.map((prod) => (
                    <option key={prod._id} value={prod._id} disabled={prod.quantity <= 0}>
                      {prod.name} | [Stock: {prod.quantity}] | ₹{prod.price}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity input */}
              <div className="sm:col-span-1 space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Quantity
                </label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 font-mono font-bold text-center"
                />
              </div>

              {/* Push Trigger Button */}
              <button
                type="button"
                onClick={handleAddItem}
                className="sm:col-span-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm h-[42px] rounded-xl shadow-md shadow-blue-500/10 flex items-center justify-center gap-1 transition-all"
              >
                <FiPlus size={16} /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Invoice Running Ledger View */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 flex flex-col justify-between min-h-[380px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <FiShoppingBag /> Order Breakdown
              </h2>
              <span className="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">
                {orderItems.length} {orderItems.length === 1 ? "Item" : "Items"}
              </span>
            </div>

            {/* List Array Map */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[220px] overflow-y-auto pr-1">
              {orderItems.length === 0 ? (
                <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm font-medium">
                  No inventory nodes queued for dispatch yet.
                </div>
              ) : (
                orderItems.map((item) => {
                  const prod = products.find((p) => p._id === item.product);
                  return (
                    <div key={item.product} className="flex justify-between items-center py-2.5 text-sm group">
                      <div className="flex flex-col max-w-[160px]">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{prod?.name || "Deleted Node"}</span>
                        <span className="text-xs text-slate-400 font-mono">
                          {item.quantity} × ₹{prod?.price || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900 dark:text-white font-mono">
                          ₹{((prod?.price || 0) * item.quantity).toLocaleString("en-IN")}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.product)}
                          className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors"
                          title="Remove item"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Running Summaries & Checkout Commit Action */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Gross Valuation:</span>
              <span className="text-3xl font-extrabold font-mono tracking-tight text-blue-600 dark:text-blue-400">
                ₹{runningTotal.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || orderItems.length === 0}
              className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm py-3 rounded-xl shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.99] ${
                loading || orderItems.length === 0 ? "opacity-40 cursor-not-allowed shadow-none" : ""
              }`}
            >
              {loading ? "Committing Ledger Pipeline..." : "Commit Statement Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOrder;