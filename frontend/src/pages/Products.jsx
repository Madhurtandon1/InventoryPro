// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "../utils/axios.js";
// import { Toaster, toast } from "react-hot-toast";

// const Products = () => {
//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const isLowStockView = queryParams.get("lowStock") === "true";

//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [showCategories, setShowCategories] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     price: "",
//     quantity: "",
//     category: "",
//     description: "",
//     supplier: "",
//   });

//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [selectedProductId, setSelectedProductId] = useState(null);

//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get("/products/categories", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCategories(res.data.data);
//     } catch (err) {
//       console.error("Failed to fetch categories", err);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const params = {};
//       if (isLowStockView) params.lowStock = true;
//       if (selectedCategory) params.category = selectedCategory;
//       if (searchTerm) params.search = searchTerm;

//       const res = await axios.get("/products", {
//         headers: { Authorization: `Bearer ${token}` },
//         params,
//       });

//       setProducts( res.data.data.products);
//     } catch (err) {
//       console.error("Failed to fetch products", err);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     fetchProducts();
//   }, [location.search, selectedCategory, searchTerm]);

//   const handleEdit = (product) => {
//     setEditingProduct(product._id);
//     setFormData({
//       name: product.name,
//       price: product.price,
//       quantity: product.quantity,
//       category: product.category,
//       description: product.description,
//       supplier: product.supplier || "",
//     });
//   };

//   const handleUpdate = async () => {
//     try {
//       await axios.put(`/products/${editingProduct}`, formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("✅ Product updated successfully!");
//       setEditingProduct(null);
//       fetchProducts();
//     } catch (err) {
//       console.error("Update failed", err);
//       toast.error("❌ Failed to update product");
//     }
//   };

//   const confirmDelete = (id) => {
//     setSelectedProductId(id);
//     setShowConfirmModal(true);
//   };

//   const handleDelete = async () => {
//     try {
//       await axios.delete(`/products/${selectedProductId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("🗑️ Product deleted successfully!");
//       setShowConfirmModal(false);
//       setSelectedProductId(null);
//       fetchProducts();
//     } catch (err) {
//       console.error("Delete failed", err);
//       toast.error("❌ Failed to delete product");
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   return (
//     <div className="p-6">
//       <Toaster position="top-right" />
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold text-gray-800">
//           📦 Product List {isLowStockView && "(Low Stock)"} {selectedCategory && `- ${selectedCategory}`}
//         </h1>
//         <button
//           onClick={() => navigate("/products/add")}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
//         >
//           ➕ Add Product
//         </button>
//       </div>

//       {/* Category Toggle */}
//       <div className="mb-4">
//         <button
//           onClick={() => setShowCategories(!showCategories)}
//           className="bg-gray-300 px-3 py-1 rounded"
//         >
//           {showCategories ? "Hide Categories" : "Show Categories"}
//         </button>
//       </div>

//       {/* Category Buttons */}
//       {showCategories && (
//         <div className="mb-6 flex flex-wrap gap-2">
//           <button
//             className={`px-3 py-1 rounded text-sm ${
//               selectedCategory === null
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-200 hover:bg-gray-300"
//             }`}
//             onClick={() => setSelectedCategory(null)}
//           >
//             All
//           </button>
//           {categories.map((cat) => (
//             <button
//               key={cat}
//               className={`px-3 py-1 rounded text-sm ${
//                 selectedCategory === cat
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-200 hover:bg-gray-300"
//               }`}
//               onClick={() => setSelectedCategory(cat)}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>
//       )}

//       {/* Search bar */}
//       <div className="mb-6">
//         <input
//           type="text"
//           placeholder="🔍 Search by name or SKU..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full border px-4 py-2 rounded shadow bg-gray-800"
//         />
//       </div>

//       {/* Product Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full table-auto border text-sm text-gray-800 dark:text-gray-600">
//           <thead className="bg-gray-200 dark:bg-gray-400 text-left">
//             <tr>
//               <th className="px-4 py-2 border">SKU</th>
//               <th className="px-4 py-2 border">Name</th>
//               <th className="px-4 py-2 border">Price</th>
//               <th className="px-4 py-2 border">Qty</th>
//               <th className="px-4 py-2 border">Category</th>
//               <th className="px-4 py-2 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {products.map((prod) =>
//               editingProduct === prod._id ? (
//                 <tr key={prod._id} className="bg-yellow-100 dark:bg-gray-100">
//                   <td className="px-2 py-1 border">{prod.sku}</td>
//                   <td className="px-2 py-1 border">
//                     <input
//                       name="name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       className="border px-2 py-1 w-full rounded"
//                     />
//                   </td>
//                   <td className="px-2 py-1 border">
//                     <input
//                       name="price"
//                       value={formData.price}
//                       onChange={handleChange}
//                       type="number"
//                       className="border px-2 py-1 w-full rounded"
//                     />
//                   </td>
//                   <td className="px-2 py-1 border">
//                     <input
//                       name="quantity"
//                       value={formData.quantity}
//                       onChange={handleChange}
//                       type="number"
//                       className="border px-2 py-1 w-full rounded"
//                     />
//                   </td>
//                   <td className="px-2 py-1 border">
//                     <input
//                       name="category"
//                       value={formData.category}
//                       onChange={handleChange}
//                       className="border px-2 py-1 w-full rounded"
//                     />
//                   </td>
//                   <td className="px-2 py-1 border space-x-2">
//                     <button
//                       onClick={handleUpdate}
//                       className="bg-green-600 text-white px-2 py-1 rounded"
//                     >
//                       Save
//                     </button>
//                     <button
//                       onClick={() => setEditingProduct(null)}
//                       className="bg-gray-500 text-white px-2 py-1 rounded"
//                     >
//                       Cancel
//                     </button>
//                   </td>
//                 </tr>
//               ) : (
//                 <tr key={prod._id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
//                   <td className="px-4 py-2 border">{prod.sku}</td>
//                   <td className="px-4 py-2 border">{prod.name}</td>
//                   <td className="px-4 py-2 border">₹{prod.price}</td>
//                   <td className="px-4 py-2 border">{prod.quantity}</td>
//                   <td className="px-4 py-2 border">{prod.category}</td>
//                   <td className="px-4 py-2 border space-x-2">
//                     <button
//                       onClick={() => handleEdit(prod)}
//                       className="bg-blue-500 text-white px-2 py-1 rounded"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => confirmDelete(prod._id)}
//                       className="bg-red-500 text-white px-2 py-1 rounded"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               )
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Delete Confirmation Modal */}
//       {showConfirmModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
//             <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
//             <p className="mb-4 text-gray-700">
//               Are you sure you want to delete this product?
//             </p>
//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => setShowConfirmModal(false)}
//                 className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Products;




import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../utils/axios.js";
import { Toaster, toast } from "react-hot-toast";
import { FiBox, FiPlus, FiSearch, FiSliders, FiEdit2, FiTrash2, FiCheck, FiX, FiAlertTriangle } from "react-icons/fi";

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

      setProducts(res.data.data.products);
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
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 bg-[#F8FAFC] dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Toaster position="top-right" />
      
      {/* Header Unit */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <FiBox className="text-blue-600 dark:text-blue-500" /> 
            <span>Product Workspace</span>
            {isLowStockView && (
              <span className="ml-2 text-xs font-bold uppercase tracking-wide bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                <FiAlertTriangle className="animate-pulse" /> Low Stock
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your global catalog items, monitor supply velocity, and align storage structures.
          </p>
        </div>
        
        <button
          onClick={() => navigate("/products/add")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98]"
        >
          <FiPlus size={16} /> Add New Product
        </button>
      </div>

      {/* Control Actions (Search & Filter Layout) */}
      <div className="grid grid-cols-1 md:flex md:items-center md:justify-between gap-4">
        {/* Search Field */}
        <div className="relative flex-1 max-w-lg">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <FiSearch size={16} />
          </span>
          <input
            type="text"
            placeholder="Search catalog by system name or serial SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
          />
        </div>

        {/* Category Trigger */}
        <button
          onClick={() => setShowCategories(!showCategories)}
          className={`flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border transition-all ${
            showCategories
              ? "bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
          }`}
        >
          <FiSliders size={14} />
          {showCategories ? "Hide Categories" : "Filter by Category"}
        </button>
      </div>

      {/* Category Selection Carousel */}
      {showCategories && (
        <div className="p-3 bg-slate-100/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 rounded-xl flex flex-wrap gap-1.5 transition-all">
          <button
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              selectedCategory === null
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Data Table Workspace Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">SKU / Code</th>
                <th className="px-6 py-3.5">Product Name</th>
                <th className="px-6 py-3.5">Unit Price</th>
                <th className="px-6 py-3.5">Warehouse Qty</th>
                <th className="px-6 py-3.5">Category Node</th>
                <th className="px-6 py-3.5 text-right">Control Registry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400 dark:text-slate-500 font-medium">
                    No active product nodes match your search query filters.
                  </td>
                </tr>
              ) : (
                products.map((prod) =>
                  editingProduct === prod._id ? (
                    /* Active Edit Form Row Layout */
                    <tr key={prod._id} className="bg-blue-50/40 dark:bg-blue-950/10">
                      <td className="px-6 py-3 font-mono text-slate-400 dark:text-slate-500 font-medium">{prod.sku}</td>
                      <td className="px-4 py-3">
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          type="number"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          type="number"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                        />
                      </td>
                      <td className="px-6 py-3 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={handleUpdate}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg inline-flex items-center shadow-sm transition-colors"
                          title="Save Changes"
                        >
                          <FiCheck size={15} />
                        </button>
                        <button
                          onClick={() => setEditingProduct(null)}
                          className="bg-slate-400 hover:bg-slate-500 text-white p-2 rounded-lg inline-flex items-center shadow-sm transition-colors"
                          title="Cancel"
                        >
                          <FiX size={15} />
                        </button>
                      </td>
                    </tr>
                  ) : (
                    /* Display Layout Row Module */
                    <tr key={prod._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 group transition-colors">
                      <td className="px-6 py-4 font-mono font-semibold text-xs text-slate-500 dark:text-slate-400">{prod.sku}</td>
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{prod.name}</td>
                      <td className="px-6 py-4 font-mono text-slate-900 dark:text-white font-medium">₹{Number(prod.price).toLocaleString("en-IN")}</td>
                      <td className="px-6 py-4">
                        <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                          prod.quantity <= 5 
                            ? "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400" 
                            : "text-slate-900 dark:text-white"
                        }`}>
                          {prod.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                          {prod.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(prod)}
                          className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 p-2 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg inline-flex items-center transition-colors"
                          title="Edit Node"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => confirmDelete(prod._id)}
                          className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg inline-flex items-center transition-colors"
                          title="Delete Node"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal Overlay */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-xl max-w-sm w-full space-y-4">
            <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <FiAlertTriangle size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Confirm Removal</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Are you completely sure you want to delete this product? This choice immediately updates terminal balances and catalog caches permanently.
              </p>
            </div>
            <div className="flex justify-end space-x-2.5 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-semibold bg-rose-600 text-white rounded-xl hover:bg-rose-700 shadow-md shadow-rose-500/10 transition-colors"
              >
                Delete Node
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;