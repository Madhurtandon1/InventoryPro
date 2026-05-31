// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "../utils/axios.js";;
// import toast from "react-hot-toast";

// const EditCustomer = () => {
//   const { customerId } = useParams();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     address: "",
//   });

//   useEffect(() => {
//     const fetchCustomer = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(`/customers/id/${customerId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         setForm(res.data.data);
//       } catch (error) {
//         toast.error("Failed to load customer");
//       }
//     };

//     fetchCustomer();
//   }, [customerId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(`/api/v1/customers/${customerId}`, form, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       toast.success("Customer updated successfully!");
//       navigate("/customers");
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Failed to update");
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto bg-white p-6 shadow rounded">
//       <h2 className="text-xl font-semibold mb-4">✏️ Edit Customer</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block mb-1">Name *</label>
//           <input
//             type="text"
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded"
//             required
//           />
//         </div>

//         <div>
//           <label className="block mb-1">Phone</label>
//           <input
//             type="text"
//             name="phone"
//             value={form.phone}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded"
//           />
//         </div>

//         <div>
//           <label className="block mb-1">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded"
//           />
//         </div>

//         <div>
//           <label className="block mb-1">Address</label>
//           <textarea
//             name="address"
//             value={form.address}
//             onChange={handleChange}
//             className="w-full border px-3 py-2 rounded"
//             rows={3}
//           />
//         </div>

//         <button
//           type="submit"
//           className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
//         >
//           Update Customer
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditCustomer;




import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios.js";
import toast from "react-hot-toast";
import { FiEdit3, FiUser, FiPhone, FiMail, FiMapPin, FiCheckCircle } from "react-icons/fi";

const EditCustomer = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/customers/id/${customerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Safe fallback assignment for nested data architecture structures
        setForm({
          name: res.data.data.name || "",
          phone: res.data.data.phone || "",
          email: res.data.data.email || "",
          address: res.data.data.address || "",
        });
      } catch (error) {
        toast.error("Failed to load customer profile details");
      }
    };

    fetchCustomer();
  }, [customerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/v1/customers/${customerId}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Customer updated successfully!");
      navigate("/customers");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update record");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Header Element Group */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-200 dark:border-slate-800 gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <FiEdit3 className="text-blue-600 dark:text-blue-500" />
            <span>Modify Customer Profile</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Mutate active database attributes for client entry node instance: <span className="font-mono text-xs text-slate-400 font-semibold">{customerId}</span>
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
            Record Properties
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FiUser className="text-slate-400" /> Account Name Profile <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
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
                value={form.phone}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-mono"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <FiMail className="text-slate-400" /> Email Destination
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-medium"
            />
          </div>

          {/* Address Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <FiMapPin className="text-slate-400" /> Physical Location Address
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>

          {/* Action Execution Button Area */}
          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 flex items-center gap-2 transition-all duration-150 active:scale-[0.98]"
            >
              <FiCheckCircle size={16} /> Update Customer Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomer;