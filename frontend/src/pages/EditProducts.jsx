// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "../utils/axios.js";;
// import toast from "react-hot-toast";

// const EditProduct = () => {
//   const { id } = useParams(); // Product ID from URL
//   const navigate = useNavigate();

//   const [product, setProduct] = useState({
//     name: "",
//     sku: "",
//     description: "",
//     price: "",
//     quantity: "",
//     category: "",
//     supplier: "",
//     image: null,
//   });

//   const [existingImage, setExistingImage] = useState("");

//   // Fetch product details
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(`/products/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = res.data?.data;

//         setProduct({
//           name: data.name,
//           sku: data.sku,
//           description: data.description,
//           price: data.price,
//           quantity: data.quantity,
//           category: data.category,
//           supplier: data.supplier,
//           image: null,
//         });
//         setExistingImage(data.image);
//       } catch (err) {
//         toast.error("Failed to load product");
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setProduct((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     Object.entries(product).forEach(([key, value]) => {
//       if (value) formData.append(key, value);
//     });

//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(`/api/v1/products/${id}`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       toast.success("Product updated successfully");
//       navigate("/products");
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.message || "Failed to update product"
//       );
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
//       <h2 className="text-xl font-semibold mb-4">✏️ Edit Product</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block mb-1">Product Name *</label>
//           <input
//             type="text"
//             name="name"
//             value={product.name}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded "
//             required
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block mb-1">SKU</label>
//             <input
//               type="text"
//               name="sku"
//               value={product.sku}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded"
//             />
//           </div>
//           <div>
//             <label className="block mb-1">Category</label>
//             <input
//               type="text"
//               name="category"
//               value={product.category}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded"
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block mb-1">Description</label>
//           <textarea
//             name="description"
//             value={product.description}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded"
//             rows={3}
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block mb-1">Price *</label>
//             <input
//               type="number"
//               name="price"
//               value={product.price}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded"
//               required
//             />
//           </div>
//           <div>
//             <label className="block mb-1">Quantity *</label>
//             <input
//               type="number"
//               name="quantity"
//               value={product.quantity}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded"
//               required
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block mb-1">Supplier</label>
//           <input
//             type="text"
//             name="supplier"
//             value={product.supplier}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded"
//           />
//         </div>

//         <div>
//           <label className="block mb-1">Current Image</label>
//           {existingImage ? (
//             <img
//               src={existingImage}
//               alt="Product"
//               className="w-32 h-32 object-cover rounded"
//             />
//           ) : (
//             <p className="text-sm text-gray-500">No image available</p>
//           )}
//         </div>

//         <div>
//           <label className="block mb-1">Replace Image</label>
//           <input
//             type="file"
//             name="image"
//             accept="image/*"
//             onChange={handleChange}
//             className="w-full"
//           />
//         </div>

//         <button
//           type="submit"
//           className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
//         >
//           Update Product
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditProduct;




import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios.js";
import toast from "react-hot-toast";
import { FiEdit3, FiBox, FiTag, FiLayers, FiFileText, FiDollarSign, FiTruck, FiImage, FiUpload, FiCheckCircle } from "react-icons/fi";

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
  const [imagePreview, setImagePreview] = useState(null);

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
          name: data.name || "",
          sku: data.sku || "",
          description: data.description || "",
          price: data.price || "",
          quantity: data.quantity || "",
          category: data.category || "",
          supplier: data.supplier || "",
          image: null,
        });
        setExistingImage(data.image || "");
      } catch (err) {
        toast.error("Failed to load product details");
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setProduct((prev) => ({ ...prev, [name]: files[0] }));
      setImagePreview(URL.createObjectURL(files[0])); // Generate runtime dynamic browser path string
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(product).forEach(([key, value]) => {
      if (value !== null && value !== "") formData.append(key, value);
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
    <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Header Element Group */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-200 dark:border-slate-800 gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <FiEdit3 className="text-blue-600 dark:text-blue-500" />
            <span>Modify Product Properties</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Mutate asset fields, restructure quantities, or alter image node attachments securely.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/products")}
          className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold text-sm px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl transition-all"
        >
          Cancel & Return
        </button>
      </div>

      {/* Main Core Form Card Wrapper */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Active Registry Attributes
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
              required
            />
          </div>

          {/* SKU and Category Grid Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FiTag className="text-slate-400" /> SKU Serial Code
              </label>
              <input
                type="text"
                name="sku"
                value={product.sku}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-mono"
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
            />
          </div>

          {/* Price & Quantity Grid Block */}
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
            />
          </div>

          {/* Media Engine/Image Handling Component Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            
            {/* Left Box: Current Stored Entity */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <FiImage /> Stored Registry Image
              </label>
              <div className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 rounded-xl p-4 flex items-center justify-center min-h-[140px]">
                {existingImage ? (
                  <img
                    src={existingImage}
                    alt="Active Product context"
                    className="max-h-28 max-w-full object-contain rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
                  />
                ) : (
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">No graphical asset bound to node index.</span>
                )}
              </div>
            </div>

            {/* Right Box: Appending Input Payload */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <FiUpload /> Upload Replacement Payload
              </label>
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl p-4 flex flex-col items-center justify-center min-h-[140px] relative hover:border-slate-300 dark:hover:border-slate-700 transition-colors group">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Staged variant timeline check"
                    className="max-h-24 max-w-full object-contain rounded-lg border border-slate-200 dark:border-slate-700 bg-white"
                  />
                ) : (
                  <div className="text-center space-y-1 pointer-events-none">
                    <FiImage className="mx-auto text-slate-400 group-hover:text-slate-500 transition-colors" size={24} />
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Click to overwrite asset node</p>
                    <p className="text-[10px] text-slate-400">PNG, JPG, or WEBP allocation bounds</p>
                  </div>
                )}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Action Execution Button Area */}
          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 flex items-center gap-2 transition-all duration-150 active:scale-[0.98]"
            >
              <FiCheckCircle size={16} /> Commit Parameter Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;