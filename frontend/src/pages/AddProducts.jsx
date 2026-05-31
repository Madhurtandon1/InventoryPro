// import React, { useState } from "react";
// import axios from "../utils/axios.js";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// const AddProduct = () => {
//   const navigate = useNavigate();
//   const [product, setProduct] = useState({
//     name: "",
//     sku: "",
//     description: "",
//     price: "",
//     quantity: "",
//     category: "",
//     supplier: ""
    
//   });

//  const handleChange = (e) => {
//   const { name, value } = e.target;
//   setProduct((prev) => ({
//     ...prev,
//     [name]: value,
//   }));
// };


//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!product.name || !product.price || !product.quantity ) {
//       return toast.error("Please fill all required fields.");
//     }

   

//     try {
//       const token = localStorage.getItem("token");
//       await axios.post("/products", product, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       toast.success("Product added successfully!");
//       navigate("/products");
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed to add product");
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md mt-6">
//       <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
//         ➕ Add New Product
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Product Name */}
//         <div>
//           <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
//             Product Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             name="name"
//             value={product.name}
//             onChange={handleChange}
//             className="w-full border rounded px-4 py-2 text-gray-800 dark:text-white dark:bg-gray-800"
//             placeholder="E.g. Bluetooth Speaker"
//             required
//           />
//         </div>

//         {/* SKU and Category */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-gray-700 dark:text-gray-300 mb-1">
//               SKU<span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="sku"
//               value={product.sku}
//               onChange={handleChange}
//               className="w-full border rounded px-4 py-2 dark:text-white dark:bg-gray-800"
//               placeholder="Optional - Leave blank to auto-generate"
//             />
//           </div>
//           <div>
//             <label className="block text-gray-700 dark:text-gray-300 mb-1">
//               Category
//             </label>
//             <input
//               type="text"
//               name="category"
//               value={product.category}
//               onChange={handleChange}
//               className="w-full border rounded px-4 py-2 dark:text-white dark:bg-gray-800"
//               placeholder="e.g. Electronics, Grocery"
//             />
//           </div>
//         </div>

//         {/* Description */}
//         <div>
//           <label className="block text-gray-700 dark:text-gray-300 mb-1">
//             Description
//           </label>
//           <textarea
//             name="description"
//             value={product.description}
//             onChange={handleChange}
//             rows={3}
//             className="w-full border rounded px-4 py-2 dark:text-white dark:bg-gray-800"
//             placeholder="Short product description"
//           />
//         </div>

//         {/* Price & Quantity */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-gray-700 dark:text-gray-300 mb-1">
//               Price (₹) <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="number"
//               name="price"
//               value={product.price}
//               onChange={handleChange}
//               className="w-full border rounded px-4 py-2 dark:text-white dark:bg-gray-800"
//               required
//               placeholder="e.g. 1499"
//             />
//           </div>
//           <div>
//             <label className="block text-gray-700 dark:text-gray-300 mb-1">
//               Quantity <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="number"
//               name="quantity"
//               value={product.quantity}
//               onChange={handleChange}
//               className="w-full border rounded px-4 py-2 dark:text-white dark:bg-gray-800"
//               required
//               placeholder="e.g. 10"
//             />
//           </div>
//         </div>

//         {/* Supplier */}
//         <div>
//           <label className="block text-gray-700 dark:text-gray-300 mb-1">
//             Supplier
//           </label>
//           <input
//             type="text"
//             name="supplier"
//             value={product.supplier}
//             onChange={handleChange}
//             className="w-full border rounded px-4 py-2 dark:text-white dark:bg-gray-800"
//             placeholder="Supplier Name (optional)"
//           />
//         </div>

   
      

//         {/* Submit Button */}
//         <div className="flex justify-end">
//           <button
//             type="submit"
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
//           >
//             ➕ Add Product
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddProduct;




import React, { useState } from "react";
import axios from "../utils/axios.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiPlusCircle, FiBox, FiDollarSign, FiLayers, FiTag, FiTruck, FiFileText } from "react-icons/fi";

const AddProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    supplier: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.name || !product.price || !product.quantity) {
      return toast.error("Please fill all required fields.");
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post("/products", product, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Product added successfully!");
      navigate("/products");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Back Button & Header Element Group */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-200 dark:border-slate-800 gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <FiPlusCircle className="text-blue-600 dark:text-blue-500" />
            <span>Create New Product</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Instantiate an active inventory unit node inside your centralized catalog framework.
          </p>
        </div>
        <button
          onClick={() => navigate("/products")}
          className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold text-sm px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl transition-all"
        >
          Cancel & Return
        </button>
      </div>

      {/* Main Core Form Card Wrapper */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section Indicator Label */}
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Node Attributes & Parameters
          </h2>

          {/* Product Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <FiBox className="text-slate-400" /> Product Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-medium"
              placeholder="E.g. Bluetooth Studio Speaker Pro"
              required
            />
          </div>

          {/* SKU and Category Grid Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FiTag className="text-slate-400" /> SKU Serial Code <span className="text-slate-400 dark:text-slate-500">(Optional)</span>
              </label>
              <input
                type="text"
                name="sku"
                value={product.sku}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-mono"
                placeholder="Leave blank for automatic generation"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FiLayers className="text-slate-400" /> Category Cluster
              </label>
              <input
                type="text"
                name="category"
                value={product.category}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-medium"
                placeholder="e.g. Electronics, Audio, Wearables"
              />
            </div>
          </div>

          {/* Description Textarea Node */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <FiFileText className="text-slate-400" /> Catalog Description
            </label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
              placeholder="Enter product summary description, metrics specifications or properties notes..."
            />
          </div>

          {/* Ledger Pricing & Warehouse Stock Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FiDollarSign className="text-slate-400" /> Unit Cost Price (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-mono font-bold"
                required
                placeholder="e.g. 1499"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FiBox className="text-slate-400" /> Warehouse Quantity <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={product.quantity}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-mono font-bold"
                required
                placeholder="e.g. 25"
              />
            </div>
          </div>

          {/* Supplier Registry Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <FiTruck className="text-slate-400" /> Designated Supplier Instance
            </label>
            <input
              type="text"
              name="supplier"
              value={product.supplier}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-medium"
              placeholder="Supplier or manufacturer account identity profile name"
            />
          </div>

          {/* Submit/Execution Button Action Area */}
          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 flex items-center gap-2 transition-all duration-150 active:scale-[0.98]"
            >
              <FiPlusCircle size={16} /> Save Product to Ledger
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;