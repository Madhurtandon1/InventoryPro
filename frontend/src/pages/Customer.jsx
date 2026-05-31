// import React, { useEffect, useState } from "react";
// import axios from "../utils/axios.js";
// import { useNavigate } from "react-router-dom";
// import { Toaster, toast } from "react-hot-toast";
// import { useAuth } from "../context/AuthContext";

// const Customers = () => {
//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [customers, setCustomers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [editingCustomer, setEditingCustomer] = useState(null);
//   const [formData, setFormData] = useState({ name: "", phone: "", email: "", address: "" });
//   const [recentDays, setRecentDays] = useState(7);

//   const [showModal, setShowModal] = useState(false);
//   const [customerToDelete, setCustomerToDelete] = useState(null);

//   const fetchCustomers = async () => {
//     try {
//       const res = await axios.get("/customers", {
//         headers: { Authorization: `Bearer ${token}` },
//         params: search ? { search } : {},
//       });
//       setCustomers(res.data.data.customers);
//     } catch {
//       toast.error("❌ Failed to fetch customers");
//     }
//   };

//   const getTopCustomers = async () => {
//     try {
//       const res = await axios.get("/customers/analytics/top", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCustomers(res.data.data);
//     } catch {
//       toast.error("❌ Failed to fetch top customers");
//     }
//   };

//   const getRecentCustomers = async () => {
//     try {
//       const res = await axios.get(`/customers/analytics/recent?days=${recentDays}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCustomers(res.data.data);
//     } catch {
//       toast.error("❌ Failed to fetch recent customers");
//     }
//   };

//   const getCustomersWithoutOrders = async () => {
//     try {
//       const res = await axios.get("/customers/analytics/no-orders", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCustomers(res.data.data);
//     } catch {
//       toast.error("❌ Failed to fetch customers without orders");
//     }
//   };

//   useEffect(() => {
//     fetchCustomers();
//   }, [search]);

//   const handleEdit = (cust) => {
//     setEditingCustomer(cust._id);
//     setFormData({ name: cust.name, phone: cust.phone, email: cust.email, address: cust.address });
//   };

//   const handleUpdate = async () => {
//     try {
//       await axios.put(`/customers/${editingCustomer}`, formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("✅ Customer updated successfully");
//       setEditingCustomer(null);
//       fetchCustomers();
//     } catch {
//       toast.error("❌ Update failed");
//     }
//   };

//   const confirmDelete = (cust) => {
//     setCustomerToDelete(cust);
//     setShowModal(true);
//   };

//   const handleDelete = async () => {
//     try {
//       await axios.delete(`/customers/${customerToDelete._id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("🗑️ Customer deleted successfully");
//       setShowModal(false);
//       setCustomerToDelete(null);
//       fetchCustomers();
//     } catch {
//       toast.error("❌ Delete failed");
//     }
//   };

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <Toaster position="top-right" />
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">👥 Customers</h1>
//         {user?.role === "admin" && (
//           <button
//             onClick={() => navigate("/customers/add")}
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           >
//             ➕ Add Customer
//           </button>
//         )}
//       </div>

//       {/* Filter & Analytics Buttons */}
//       <div className="flex gap-2 mb-4 flex-wrap">
//         <input
//           type="text"
//           placeholder="🔍 Search customers by name..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="border px-4 py-2 rounded dark:bg-gray-800 dark:text-white"
//         />
//         <button onClick={getTopCustomers} className="bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700">Top Customers</button>
//         <div className="flex items-center gap-1">
//           <input
//             type="number"
//             min="1"
//             value={recentDays}
//             onChange={(e) => setRecentDays(e.target.value)}
//             className="border px-2 py-1 rounded w-20 bg-gray-800 text-white"
//           />
//           <button onClick={getRecentCustomers} className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">Recent</button>
//         </div>
//         <button onClick={getCustomersWithoutOrders} className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700">No Orders</button>
//         <button onClick={fetchCustomers} className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700">Reset</button>
//       </div>

//       {/* Customer Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full table-auto border text-sm text-gray-800 dark:text-gray-600">
//           <thead className="bg-gray-200 dark:bg-gray-400 text-left">
//             <tr>
//               <th className="px-4 py-2 border">Customer ID</th>
//               <th className="px-4 py-2 border">Name</th>
//               <th className="px-4 py-2 border">Phone</th>
//               <th className="px-4 py-2 border">Email</th>
//               <th className="px-4 py-2 border">Address</th>
//               {user?.role === "admin" && <th className="px-4 py-2 border">Actions</th>}
//             </tr>
//           </thead>
//           <tbody>
//             {customers.map((cust) =>
//               editingCustomer === cust._id ? (
//                 <tr key={cust._id} className="bg-yellow-50 dark:bg-gray-100">
//                   <td className="px-2 py-1 border">{cust.customerId}</td>
//                   <td className="px-2 py-1 border">
//                     <input name="name" value={formData.name} onChange={handleChange} className="border px-2 py-1 w-full" />
//                   </td>
//                   <td className="px-2 py-1 border">
//                     <input name="phone" value={formData.phone} onChange={handleChange} className="border px-2 py-1 w-full" />
//                   </td>
//                   <td className="px-2 py-1 border">
//                     <input name="email" value={formData.email} onChange={handleChange} className="border px-2 py-1 w-full" />
//                   </td>
//                   <td className="px-2 py-1 border">
//                     <input name="address" value={formData.address} onChange={handleChange} className="border px-2 py-1 w-full" />
//                   </td>
//                   <td className="px-2 py-1 border whitespace-nowrap">
//                     <button onClick={handleUpdate} className="bg-green-600 text-white px-2 py-1 rounded mr-2">Save</button>
//                     <button onClick={() => setEditingCustomer(null)} className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
//                   </td>
//                 </tr>
//               ) : (
//                 <tr key={cust._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
//                   <td className="px-4 py-2 border">{cust.customerId}</td>
//                   <td className="px-4 py-2 border">{cust.name}</td>
//                   <td className="px-4 py-2 border">{cust.phone}</td>
//                   <td className="px-4 py-2 border">{cust.email}</td>
//                   <td className="px-4 py-2 border">{cust.address}</td>
//                   {user?.role === "admin" && (
//                     <td className="px-4 py-2 border whitespace-nowrap">
//                       <button onClick={() => handleEdit(cust)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit</button>
//                       <button onClick={() => confirmDelete(cust)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
//                     </td>
//                   )}
//                 </tr>
//               )
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Delete Confirmation Modal */}
//       {showModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
//             <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
//               Confirm Deletion
//             </h2>
//             <p className="text-gray-600 dark:text-gray-300 mb-6">
//               Are you sure you want to delete <strong>{customerToDelete?.name}</strong>?
//             </p>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={handleDelete}
//                 className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//               >
//                 Yes, Delete
//               </button>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Customers;



import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios.js";
import { Toaster, toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { FiUsers, FiUserPlus, FiSearch, FiFilter, FiTrendingUp, FiClock, FiAlertCircle, FiRefreshCw, FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";

const Customers = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { user } = useAuth();

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", address: "" });
  const [recentDays, setRecentDays] = useState(7);
  const [activeFilter, setActiveFilter] = useState("all"); // tracking state for active context UI

  const [showModal, setShowModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("/customers", {
        headers: { Authorization: `Bearer ${token}` },
        params: search ? { search } : {},
      });
      setCustomers(res.data.data.customers);
      setActiveFilter("all");
    } catch {
      toast.error("❌ Failed to fetch customers");
    }
  };

  const getTopCustomers = async () => {
    try {
      const res = await axios.get("/customers/analytics/top", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(res.data.data);
      setActiveFilter("top");
    } catch {
      toast.error("❌ Failed to fetch top customers");
    }
  };

  const getRecentCustomers = async () => {
    try {
      const res = await axios.get(`/customers/analytics/recent?days=${recentDays}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(res.data.data);
      setActiveFilter("recent");
    } catch {
      toast.error("❌ Failed to fetch recent customers");
    }
  };

  const getCustomersWithoutOrders = async () => {
    try {
      const res = await axios.get("/customers/analytics/no-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(res.data.data);
      setActiveFilter("no-orders");
    } catch {
      toast.error("❌ Failed to fetch customers without orders");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const handleEdit = (cust) => {
    setEditingCustomer(cust._id);
    setFormData({ name: cust.name, phone: cust.phone, email: cust.email, address: cust.address });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/customers/${editingCustomer}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ Customer updated successfully");
      setEditingCustomer(null);
      fetchCustomers();
    } catch {
      toast.error("❌ Update failed");
    }
  };

  const confirmDelete = (cust) => {
    setCustomerToDelete(cust);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/customers/${customerToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🗑️ Customer deleted successfully");
      setShowModal(false);
      setCustomerToDelete(null);
      fetchCustomers();
    } catch {
      toast.error("❌ Delete failed");
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 bg-[#F8FAFC] dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Toaster position="top-right" />

      {/* Header Module */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <FiUsers className="text-blue-600 dark:text-blue-500" />
            <span>Customer Registry</span>
            {activeFilter !== "all" && (
              <span className="ml-2 text-xs font-bold uppercase tracking-wide bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30 px-2.5 py-1 rounded-full capitalize">
                Filter: {activeFilter}
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor client acquisition timelines, historical order pipeline linkages, and account analytics profiles.
          </p>
        </div>

        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/customers/add")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98]"
          >
            <FiUserPlus size={16} /> Add Customer
          </button>
        )}
      </div>

      {/* Control Actions Console */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <FiSearch size={16} />
          </span>
          <input
            type="text"
            placeholder="Search accounts by name profile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
          />
        </div>

        {/* Analytics Action Matrix */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={getTopCustomers}
            className={`px-3 py-2 rounded-lg border font-semibold inline-flex items-center gap-1.5 transition-colors ${
              activeFilter === "top"
                ? "bg-purple-600 border-purple-600 text-white"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <FiTrendingUp size={14} /> Top Customers
          </button>

          <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5">
            <input
              type="number"
              min="1"
              value={recentDays}
              onChange={(e) => setRecentDays(e.target.value)}
              className="bg-transparent text-slate-900 dark:text-white font-mono font-bold w-12 text-center text-sm focus:outline-none"
            />
            <button
              onClick={getRecentCustomers}
              className={`px-3 py-1.5 rounded-md font-semibold inline-flex items-center gap-1 transition-colors ${
                activeFilter === "recent"
                  ? "bg-emerald-600 text-white"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <FiClock size={13} /> Recent
            </button>
          </div>

          <button
            onClick={getCustomersWithoutOrders}
            className={`px-3 py-2 rounded-lg border font-semibold inline-flex items-center gap-1.5 transition-colors ${
              activeFilter === "no-orders"
                ? "bg-rose-600 border-rose-600 text-white"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <FiAlertCircle size={14} /> Inactive (No Orders)
          </button>

          <button
            onClick={fetchCustomers}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 inline-flex items-center gap-1.5 transition-colors"
          >
            <FiRefreshCw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* Main Registry Ledger View */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">System ID</th>
                <th className="px-6 py-3.5">Name Profile</th>
                <th className="px-6 py-3.5">Phone Route</th>
                <th className="px-6 py-3.5">Email Destination</th>
                <th className="px-6 py-3.5">Primary Location Address</th>
                {user?.role === "admin" && <th className="px-6 py-3.5 text-right">Control Console</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={user?.role === "admin" ? "6" : "5"} className="text-center py-12 text-slate-400 dark:text-slate-500 font-medium">
                    No active account instances found mapping into current selection telemetry bounds.
                  </td>
                </tr>
              ) : (
                customers.map((cust) =>
                  editingCustomer === cust._id ? (
                    /* Active Node Mutation Form Inline Row */
                    <tr key={cust._id} className="bg-blue-50/40 dark:bg-blue-950/10">
                      <td className="px-6 py-3 font-mono text-slate-400 dark:text-slate-500 font-medium">{cust.customerId}</td>
                      <td className="px-4 py-3">
                        <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
                      </td>
                      <td className="px-4 py-3">
                        <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
                      </td>
                      <td className="px-4 py-3">
                        <input name="email" value={formData.email} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
                      </td>
                      <td className="px-4 py-3">
                        <input name="address" value={formData.address} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
                      </td>
                      <td className="px-6 py-3 text-right space-x-1.5 whitespace-nowrap">
                        <button onClick={handleUpdate} className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg inline-flex items-center shadow-sm transition-colors"><FiCheck size={15} /></button>
                        <button onClick={() => setEditingCustomer(null)} className="bg-slate-400 hover:bg-slate-500 text-white p-2 rounded-lg inline-flex items-center shadow-sm transition-colors"><FiX size={15} /></button>
                      </td>
                    </tr>
                  ) : (
                    /* Native Ledger Entry Display Row */
                    <tr key={cust._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 group transition-colors">
                      <td className="px-6 py-4 font-mono font-semibold text-xs text-slate-500 dark:text-slate-400">{cust.customerId}</td>
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{cust.name}</td>
                      <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300">{cust.phone}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{cust.email}</td>
                      <td className="px-6 py-4 max-w-xs truncate text-slate-500 dark:text-slate-400" title={cust.address}>{cust.address}</td>
                      {user?.role === "admin" && (
                        <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(cust)}
                            className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 p-2 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg inline-flex items-center transition-colors"
                            title="Edit Client"
                          >
                            <FiEdit2 size={14} />
                          </button>
                          <button
                            onClick={() => confirmDelete(cust)}
                            className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg inline-flex items-center transition-colors"
                            title="Remove Client"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </td>
                      )}
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Deletion Confirmation Dialog Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-xl max-w-sm w-full space-y-4 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <FiAlertCircle size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Deprecate Record</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Are you completely sure you want to remove client entry <strong>{customerToDelete?.name}</strong>? This clears target metrics securely from database schemas permanently.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2 w-full justify-center">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors w-1/2"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-semibold bg-rose-600 text-white rounded-xl hover:bg-rose-700 shadow-md shadow-rose-500/10 transition-colors w-1/2"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;