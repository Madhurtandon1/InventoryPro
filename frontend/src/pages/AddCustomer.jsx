// import React, { useState } from "react";
// import axios from "../utils/axios.js";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// const AddCustomer = () => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     address: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.name.trim()) {
//       toast.error("Customer name is required");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       await axios.post("/customers", form, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       toast.success("Customer added successfully!");
//       navigate("/customers");
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Failed to add customer");
//     }
//   };

//   return (
//  <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-lg shadow mt-6">
//   <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
//     ➕ Add New Customer
//   </h2>

//   <form
//     onSubmit={handleSubmit}
//     className="grid grid-cols-1 md:grid-cols-2 gap-6"
//   >
//     {/* Name Field */}
//     <div>
//       <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
//         Name <span className="text-red-500">*</span>
//       </label>
//       <input
//         type="text"
//         name="name"
//         placeholder="e.g., John Doe"
//         value={form.name}
//         onChange={handleChange}
//               className="w-full border rounded px-4 py-2 dark:text-white dark:bg-gray-800"
//         required
//       />
//     </div>

//     {/* Phone Field */}
//     <div>
//       <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
//         Phone
//       </label>
//       <input
//         type="text"
//         name="phone"
//         placeholder="e.g., 9876543210"
//         value={form.phone}
//         onChange={handleChange}
//               className="w-full border rounded px-4 py-2 dark:text-white dark:bg-gray-800"
//       />
//     </div>

//     {/* Email Field */}
//     <div>
//       <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
//         Email
//       </label>
//       <input
//         type="email"
//         name="email"
//         placeholder="e.g., john@example.com"
//         value={form.email}
//         onChange={handleChange}
//               className="w-full border rounded px-4 py-2 dark:text-white dark:bg-gray-800"
//       />
//     </div>

//     {/* Address Field */}
//     <div>
//       <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
//         Address
//       </label>
//       <textarea
//         name="address"
//         placeholder="e.g., 123 Main Street, City, ZIP"
//         value={form.address}
//         onChange={handleChange}
//         rows={3}
//               className="w-full border rounded px-4 py-2 dark:text-white dark:bg-gray-800"
//       />
//     </div>

//     {/* Submit Button */}
//     <div className="col-span-full text-right">
//       <button
//         type="submit"
//         className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-medium"
//       >
//         Add Customer
//       </button>
//     </div>
//   </form>
// </div>


//   );
// };

// export default AddCustomer;



import React, { useState } from "react";
import axios from "../utils/axios.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiUserPlus, FiUser, FiPhone, FiMail, FiMapPin } from "react-icons/fi";

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
    <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Header Element Group */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-200 dark:border-slate-800 gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <FiUserPlus className="text-blue-600 dark:text-blue-500" />
            <span>Register New Customer</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Create an active customer account profile linked to the core CRM database directory.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/customers")}
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
            Account Profile Attributes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FiUser className="text-slate-400" /> Customer Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g., John Doe"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-medium"
                required
              />
            </div>

            {/* Phone Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FiPhone className="text-slate-400" /> Phone Route
              </label>
              <input
                type="text"
                name="phone"
                placeholder="e.g., 9876543210"
                value={form.phone}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-mono"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <FiMail className="text-slate-400" /> Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="e.g., john@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-medium"
            />
          </div>

          {/* Address Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <FiMapPin className="text-slate-400" /> Primary Location Address
            </label>
            <textarea
              name="address"
              placeholder="e.g., 123 Main Street, City, ZIP"
              value={form.address}
              onChange={handleChange}
              rows={3}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>

          {/* Execution Button Action Area */}
          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 flex items-center gap-2 transition-all duration-150 active:scale-[0.98]"
            >
              <FiUserPlus size={16} /> Save Customer Node
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;