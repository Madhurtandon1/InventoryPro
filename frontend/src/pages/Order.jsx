// import React, { useEffect, useState } from "react";
// import axios from "../utils/axios.js";
// import { Toaster, toast } from "react-hot-toast";
// import { useAuth } from "../context/AuthContext";
// import { useLocation, useNavigate } from "react-router-dom";
// import api from "../services/api.js";

// const Order = () => {
//   const token = localStorage.getItem("token");
//   const { user } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [orders, setOrders] = useState([]);
//   const [statusFilter, setStatusFilter] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [orderToDelete, setOrderToDelete] = useState(null);

//   // Step 1: Update filter based on URL (e.g., ?status=Pending)
//   useEffect(() => {
//   const queryParams = new URLSearchParams(location.search);
//   const statusFromUrl = queryParams.get("status");

//   if (
//     statusFromUrl &&
//     ["Pending", "Completed", "Cancelled"].includes(statusFromUrl)
//   ) {
//     setStatusFilter(statusFromUrl);
//   } else {
//     setStatusFilter(""); // Default to all
//   }
// }, [location.search]);

// useEffect(() => {
//   const fetchOrdersWithUrlStatus = async () => {
//     const queryParams = new URLSearchParams(location.search);
//     const statusFromUrl = queryParams.get("status");

//     const finalStatus = ["Pending", "Completed", "Cancelled"].includes(statusFromUrl)
//       ? statusFromUrl
//       : "";

//     setStatusFilter(finalStatus);

//     try {
//       const res = await axios.get("/orders", {
//         headers: { Authorization: `Bearer ${token}` },
//         params: finalStatus ? { status: finalStatus } : {},
//       });
//       setOrders(res.data.data.orders);
//     } catch (error) {
//       toast.error("❌ Error fetching orders.");
//     }
//   };

//   fetchOrdersWithUrlStatus();
// }, [location.search, token]);



//   const handleStatusChange = async (orderNumber, newStatus) => {
//     try {
//       await axios.patch(
//         `/orders/${orderNumber}/status`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success("✅ Order status updated.");
//       // Refetch current orders
//       const updatedStatus = new URLSearchParams(location.search).get("status");
//       if (updatedStatus) setStatusFilter(updatedStatus);
//     } catch (err) {
//       toast.error("❌ Failed to update status.");
//     }
//   };

//   const confirmDelete = (orderId) => {
//     setOrderToDelete(orderId);
//     setShowConfirmModal(true);
//   };

//   const handleDelete = async () => {
//     if (!orderToDelete) return;
//     try {
//       await axios.delete(`/orders/${orderToDelete}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("🗑️ Order deleted successfully.");
//       setShowConfirmModal(false);
//       setOrderToDelete(null);
//       const currentStatus = new URLSearchParams(location.search).get("status");
//       if (currentStatus) setStatusFilter(currentStatus);
//     } catch (err) {
//       toast.error("❌ Failed to delete order.");
//     }
//   };

// const filteredOrders =  (orders || []).filter((order) => {
//     const orderMatch = order.orderNumber
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     const customerMatch = order.customer?.name
//       ?.toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     return orderMatch || customerMatch;
//   });

//   const downloadPDF = async () => {
//   try {
//     const response = await api.get("/orders/export/pdf", {
//   responseType: "blob",
//   headers: {
//     Authorization: `Bearer ${token}`, // ✅ Required
//   },
// });


//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", "orders.pdf");
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//   } catch (error) {
//     console.error("Failed to download PDF", error);
//   }
// };


//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <Toaster position="top-right" />
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">🧾 Orders</h1>

//       {/* 🔍 Filter + Search */}
//       <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
//         <div>
//           <label htmlFor="status" className="text-sm font-medium text-gray-700 mr-2">
//             Filter by status:
//           </label>
//           <select
//             id="status"
//             className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:ring-blue-500"
//             value={statusFilter}
//             onChange={(e) => {
//               const selectedStatus = e.target.value;
//               setStatusFilter(selectedStatus);
//               if (selectedStatus) {
//                 navigate(`/orders?status=${selectedStatus}`);
//               } else {
//                 navigate("/orders");
//               }
//             }}
//           >
//             <option value="">All</option>
//             <option value="Completed">Completed</option>
//             <option value="Pending">Pending</option>
//             <option value="Cancelled">Cancelled</option>
//           </select>
//         </div>

//         <input
//           type="text"
//           placeholder="🔍 Search by Order No. or Customer Name"
//           className="w-full md:w-1/3 px-4 py-2 border rounded focus:outline-none focus:ring-2 bg-gray-800 text-white"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>
    
// <div className="flex justify-end mb-4">
//   <button
//     onClick={downloadPDF}
//     className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
//   >
//     📄 Download Orders PDF
//   </button>
// </div>


//       {/* 📋 Orders Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full table-auto border text-sm rounded text-gray-800 dark:text-gray-600">
//           <thead className="bg-gray-200 dark:bg-gray-400 text-left">
//             <tr>
//               <th className="border px-4 py-3">Order No.</th>
//               <th className="border px-4 py-3">Customer</th>
//               <th className="border px-4 py-3">Items</th>
//               <th className="border px-4 py-3">Status</th>
//               <th className="border px-4 py-3">Date</th>
//               {user?.role === "admin" && <th className="border px-4 py-3">Actions</th>}
//             </tr>
//           </thead>
//           <tbody>
//             {filteredOrders.length === 0 ? (
//               <tr>
//                 <td colSpan="6" className="text-center py-6 text-gray-500">
//                   No orders found.
//                 </td>
//               </tr>
//             ) : (
//               filteredOrders.map((order) => (
//                 <tr key={order._id} className="hover:bg-gray-50">
//                   <td className="border px-4 py-2">{order.orderNumber}</td>
//                   <td className="border px-4 py-2">
//                     <div className="font-medium">{order.customer?.name || "N/A"}</div>
//                     <div className="text-xs text-gray-500">{order.customer?.email}</div>
//                   </td>
//                   <td className="border px-4 py-2">
//                     {order.items.map((item, idx) => (
//                       <div key={idx} className="text-sm">
//                         • {item.product?.name || "Deleted"} × {item.quantity}
//                       </div>
//                     ))}
//                   </td>
//                   <td className="border px-4 py-2">
//                     <span
//                       className={`inline-block px-2 py-1 rounded text-xs font-medium ${
//                         order.status === "Completed"
//                           ? "bg-green-100 text-green-800"
//                           : order.status === "Pending"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {order.status}
//                     </span>
//                   </td>
//                   <td className="border px-4 py-2">
//                     {new Date(order.createdAt).toLocaleDateString()}
//                   </td>

//                   {user?.role === "admin" && (
//                     <td className="border px-4 py-2 space-y-2">
//                       <select
//                         className="border px-2 py-1 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                         value={order.status}
//                         onChange={(e) =>
//                           handleStatusChange(order.orderNumber, e.target.value)
//                         }
//                       >
//                         <option value="Pending">Pending</option>
//                         <option value="Completed">Completed</option>
//                         <option value="Cancelled">Cancelled</option>
//                       </select>
//                       <button
//                         onClick={() => confirmDelete(order._id)}
//                         className="w-full text-red-600 hover:text-red-800 text-sm"
//                       >
//                         🗑️ Delete
//                       </button>
//                     </td>
//                   )}
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* 🧾 Confirm Delete Modal */}
//       {showConfirmModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow max-w-sm w-full">
//             <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
//               Confirm Deletion
//             </h2>
//             <p className="mb-6 text-gray-600 dark:text-gray-300">
//               Are you sure you want to delete this order? This action cannot be undone.
//             </p>
//             <div className="flex justify-end gap-4">
//               <button
//                 onClick={() => {
//                   setShowConfirmModal(false);
//                   setOrderToDelete(null);
//                 }}
//                 className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
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

// export default Order;



import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../utils/axios.js";
import { Toaster, toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../services/api.js";
import { FiFileText, FiSearch, FiFilter, FiDownload, FiTrash2, FiAlertTriangle, FiLoader } from "react-icons/fi";

const Order = () => {
  const token = localStorage.getItem("token");
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [downloading, setDownloading] = useState(false);

  // Step 1: Update filter based on URL (e.g., ?status=Pending)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const statusFromUrl = queryParams.get("status");

    if (statusFromUrl && ["Pending", "Completed", "Cancelled"].includes(statusFromUrl)) {
      setStatusFilter(statusFromUrl);
    } else {
      setStatusFilter(""); // Default to all
    }
  }, [location.search]);

  useEffect(() => {
    const fetchOrdersWithUrlStatus = async () => {
      const queryParams = new URLSearchParams(location.search);
      const statusFromUrl = queryParams.get("status");

      const finalStatus = ["Pending", "Completed", "Cancelled"].includes(statusFromUrl)
        ? statusFromUrl
        : "";

      setStatusFilter(finalStatus);

      try {
        const res = await axios.get("/orders", {
          headers: { Authorization: `Bearer ${token}` },
          params: finalStatus ? { status: finalStatus } : {},
        });
        setOrders(res.data?.data?.orders || []);
      } catch (error) {
        toast.error("❌ Error fetching orders.");
      }
    };

    fetchOrdersWithUrlStatus();
  }, [location.search, token]);

  const handleStatusChange = async (orderNumber, newStatus) => {
    try {
      await axios.patch(
        `/orders/${orderNumber}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Order status updated.");
      
      const res = await axios.get("/orders", {
        headers: { Authorization: `Bearer ${token}` },
        params: statusFilter ? { status: statusFilter } : {},
      });
      setOrders(res.data?.data?.orders || []);
    } catch (err) {
      toast.error("❌ Failed to update status.");
    }
  };

  const confirmDelete = (orderId) => {
    setOrderToDelete(orderId);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    if (!orderToDelete) return;
    try {
      await axios.delete(`/orders/${orderToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🗑️ Order deleted successfully.");
      setShowConfirmModal(false);
      setOrderToDelete(null);
      
      const res = await axios.get("/orders", {
        headers: { Authorization: `Bearer ${token}` },
        params: statusFilter ? { status: statusFilter } : {},
      });
      setOrders(res.data?.data?.orders || []);
    } catch (err) {
      toast.error("❌ Failed to delete order.");
    }
  };

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const response = await api.get("/orders/export/pdf", {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.size === 0) {
        throw new Error("Received empty dataset stream from server");
      }

      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Shop_Orders_Statement_${Date.now()}.pdf`);
      
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("📄 PDF Exported Successfully!");
    } catch (error) {
      console.error("Detailed Frontend PDF Processing Error Telemetry:", error);
      toast.error("❌ Failed to download statement PDF");
    } finally {
      setDownloading(false);
    }
  };

  const filteredOrders = (orders || []).filter((order) => {
    const orderMatch = order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const customerMatch = order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return orderMatch || customerMatch;
  });

  return (
    /* STRETCH COMPONENT WORKSPACE: Uses w-full to prevent compressed sidebar spacing */
    <div className="p-4 md:p-8 w-full min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Toaster position="top-right" />

      {/* Header Unit */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <FiFileText className="text-blue-600 dark:text-blue-500" />
            <span>All Bills / Orders</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review your shop checkout records, modify billing status options, or generate statements.
          </p>
        </div>

        <button
          onClick={downloadPDF}
          disabled={downloading}
          className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-sm px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
        >
          {downloading ? <FiLoader className="animate-spin" size={15} /> : <FiDownload size={15} />}
          <span>{downloading ? "Generating PDF..." : "Export Statement PDF"}</span>
        </button>
      </div>

      {/* Filters Toolbar Console */}
      <div className="grid grid-cols-1 md:flex md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
        
        {/* Status Dropdown */}
        <div className="flex items-center gap-2.5">
          <label htmlFor="status" className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 whitespace-nowrap">
            <FiFilter /> Order Filter:
          </label>
          <select
            id="status"
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            value={statusFilter}
            onChange={(e) => {
              const selectedStatus = e.target.value;
              setStatusFilter(selectedStatus);
              if (selectedStatus) {
                navigate(`/orders?status=${selectedStatus}`);
              } else {
                navigate("/orders");
              }
            }}
          >
            <option value="">All Shop Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <FiSearch size={16} />
          </span>
          <input
            type="text"
            placeholder="Search by bill number or customer name..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Ledger Data Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Bill Code</th>
                <th className="px-6 py-3.5">Customer Details</th>
                <th className="px-6 py-3.5">Items Purchased</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Date Created</th>
                {user?.role === "admin" && <th className="px-6 py-3.5 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={user?.role === "admin" ? "6" : "5"} className="text-center py-12 text-slate-400 dark:text-slate-500 font-medium">
                    No matching orders or bills found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 group transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-xs text-slate-900 dark:text-white">{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{order.customer?.name || "Walk-In Customer"}</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">{order.customer?.email || "No Email"}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-xs text-slate-600 dark:text-slate-400 truncate">
                          <span className="font-medium text-slate-900 dark:text-slate-200">• {item.product?.name || "Product Item"}</span>
                          <span className="font-mono text-slate-400 ml-1">×{item.quantity}</span>
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                          order.status === "Completed"
                            ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                            : order.status === "Pending"
                            ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30 text-amber-700 dark:text-amber-400"
                            : "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/30 text-rose-700 dark:text-rose-400"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>

                    {user?.role === "admin" && (
                      <td className="px-6 py-4 text-right space-y-1.5 whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity">
                        <select
                          className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-semibold rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500 cursor-pointer"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.orderNumber, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <div className="pt-1">
                          <button
                            onClick={() => confirmDelete(order._id)}
                            className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-bold inline-flex items-center gap-1 transition-colors"
                          >
                            <FiTrash2 size={12} /> Remove Bill
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-xl max-w-sm w-full space-y-4">
            <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <FiAlertTriangle size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Confirm Deletion</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Are you completely sure you want to delete this bill? This action permanently removes it from your shop history records.
              </p>
            </div>
            <div className="flex justify-end space-x-2.5 pt-2">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setOrderToDelete(null);
                }}
                className="px-4 py-2 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-semibold bg-rose-600 text-white rounded-xl hover:bg-rose-700 shadow-md shadow-rose-500/10 transition-colors"
              >
                Delete Bill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;