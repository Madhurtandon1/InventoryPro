// import React, { useEffect, useState } from "react";
// import axios from "../utils/axios";
// import { Toaster, toast } from "react-hot-toast";

// const Staff = () => {
//   const token = localStorage.getItem("token");
//   const [staff, setStaff] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [search, setSearch] = useState("");
//   const [formData, setFormData] = useState({ username: "", email: "" });
//   const [editMode, setEditMode] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   const [deleteTarget, setDeleteTarget] = useState(null); // 🧠 track item to delete

//   const fetchStaff = async () => {
//     try {
//       const res = await axios.get("/users/staff", {
//         headers: { Authorization: `Bearer ${token}` },
//         params: search ? { search } : {},
//       });

//       setStaff(res.data.data.staff);
//       setTotal(res.data.data.pagination.total || 0);
//     } catch (err) {
//       console.error(err?.response?.data?.message || err.message);
//       toast.error("❌ Failed to fetch staff");
//     }
//   };

//   const handleAdd = async () => {
//     if (!formData.username || !formData.email) {
//       toast.error("Username and email are required");
//       return;
//     }

//     try {
//       await axios.post("/users/register-staff", formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       toast.success("✅ Staff added successfully");
//       setFormData({ username: "", email: "" });
//       fetchStaff();
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "❌ Failed to add staff");
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       await axios.put(
//         `/users/staff/${editingId}`,
//         { username: formData.username, email: formData.email },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       toast.success("✅ Staff updated");
//       setFormData({ username: "", email: "" });
//       setEditMode(false);
//       setEditingId(null);
//       fetchStaff();
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "❌ Update failed");
//     }
//   };

//   const handleEdit = (staff) => {
//     setEditMode(true);
//     setEditingId(staff._id);
//     setFormData({ username: staff.username, email: staff.email });
//   };

//   const confirmDelete = async () => {
//     try {
//       await axios.delete(`/users/staff/${deleteTarget._id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("🗑️ Staff deleted");
//       setDeleteTarget(null);
//       fetchStaff();
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "❌ Delete failed");
//     }
//   };

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   useEffect(() => {
//     fetchStaff();
//   }, [search]);

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <Toaster position="top-right" />
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">
//           🧑‍🤝‍🧑 My Staff ({total})
//         </h1>
//       </div>

//       {/* 🔍 Search */}
//       <div className="mb-6">
//         <input
//           type="text"
//           placeholder="🔍 Search staff by username or email..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full md:w-1/3 border px-4 py-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       {/* ➕ Add / ✏️ Edit Form */}
//       <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md mb-8">
//         <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
//           {editMode ? " Edit Staff" : "➕ Add Staff Member"}
//         </h2>

//         <div className="grid md:grid-cols-2 gap-4">
//           {["username", "email"].map((field) => (
//             <input
//               key={field}
//               type={field === "email" ? "email" : "text"}
//               name={field}
//               placeholder={field === "username" ? "👤 Username" : "📧 Email"}
//               value={formData[field]}
//               onChange={handleChange}
//               className="w-full border px-4 py-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           ))}
//         </div>

//         <div className="mt-4 flex gap-4">
//           <button
//             onClick={editMode ? handleUpdate : handleAdd}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium"
//           >
//             {editMode ? "Update Staff" : "Add Staff"}
//           </button>
//           {editMode && (
//             <button
//               onClick={() => {
//                 setEditMode(false);
//                 setFormData({ username: "", email: "" });
//               }}
//               className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
//             >
//               Cancel
//             </button>
//           )}
//         </div>
//       </div>

//       {/* 👨‍💼 Staff Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full table-auto border text-sm">
//           <thead className=" dark:bg-gray-800 text-gray-800 dark:text-white">
//             <tr>
//               <th className="px-4 py-3 border">👤 Username</th>
//               <th className="px-4 py-3 border">📧 Email</th>
//               <th className="px-4 py-3 border">⚙️ Actions</th>
//             </tr>
//           </thead>
//           <tbody className=" dark:text-gray-600">
//             {staff.length === 0 ? (
//               <tr>
//                 <td colSpan="3" className="text-center py-6 text-gray-600">
//                   No staff found.
//                 </td>
//               </tr>
//             ) : (
//               staff.map((member) => (
//                 <tr
//                   key={member._id}
//                   className="hover:bg-gray-100 dark:hover:bg-gray-800 transition"
//                 >
//                   <td className="px-4 py-2 border font-medium">{member.username}</td>
//                   <td className="px-4 py-2 border">{member.email}</td>
//                   <td className="px-4 py-2 border space-x-2">
//                     <button
//                       onClick={() => handleEdit(member)}
//                       className="text-yellow-600 hover:underline"
//                     >
//                        Edit
//                     </button>
//                     <button
//                       onClick={() => setDeleteTarget(member)}
//                       className="text-red-600 hover:underline"
//                     >
//                        Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* 🧨 Delete Confirmation Modal */}
//       {deleteTarget && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-sm w-full">
//             <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//               ⚠️ Confirm Deletion
//             </h2>
//             <p className="mb-4 text-gray-700 dark:text-gray-300">
//               Are you sure you want to delete staff member{" "}
//               <span className="font-bold">{deleteTarget.username}</span>?
//             </p>
//             <div className="flex justify-end gap-4">
//               <button
//                 onClick={() => setDeleteTarget(null)}
//                 className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDelete}
//                 className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Staff;




import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { Toaster, toast } from "react-hot-toast";
import { FiUsers, FiUserPlus, FiSearch, FiEdit2, FiTrash2, FiAlertTriangle, FiUser, FiMail } from "react-icons/fi";

const Staff = () => {
  const token = localStorage.getItem("token");
  const [staff, setStaff] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchStaff = async () => {
    try {
      const res = await axios.get("/users/staff", {
        headers: { Authorization: `Bearer ${token}` },
        params: search ? { search } : {},
      });

      setStaff(res.data.data.staff);
      setTotal(res.data.data.pagination.total || 0);
    } catch (err) {
      console.error(err?.response?.data?.message || err.message);
      toast.error("❌ Failed to fetch staff");
    }
  };

  const handleAdd = async () => {
    if (!formData.username || !formData.email) {
      toast.error("Username and email are required");
      return;
    }

    try {
      await axios.post("/users/register-staff", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ Staff added successfully");
      setFormData({ username: "", email: "" });
      fetchStaff();
    } catch (err) {
      toast.error(err?.response?.data?.message || "❌ Failed to add staff");
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `/users/staff/${editingId}`,
        { username: formData.username, email: formData.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Staff updated");
      setFormData({ username: "", email: "" });
      setEditMode(false);
      setEditingId(null);
      fetchStaff();
    } catch (err) {
      toast.error(err?.response?.data?.message || "❌ Update failed");
    }
  };

  const handleEdit = (staffMember) => {
    setEditMode(true);
    setEditingId(staffMember._id);
    setFormData({ username: staffMember.username, email: staffMember.email });
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/users/staff/${deleteTarget._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🗑️ Staff deleted");
      setDeleteTarget(null);
      fetchStaff();
    } catch (err) {
      toast.error(err?.response?.data?.message || "❌ Delete failed");
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    fetchStaff();
  }, [search]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 bg-[#F8FAFC] dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Toaster position="top-right" />
      
      {/* Header Unit */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <FiUsers className="text-blue-600 dark:text-blue-500" />
            <span>Staff Management</span>
            <span className="ml-2 text-xs font-bold uppercase tracking-wide bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30 px-2.5 py-1 rounded-full">
              Total: {total}
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Authorize team access permissions, assign system operators, and track organization personnel structure.
          </p>
        </div>
      </div>

      {/* Control Actions / Search bar */}
      <div className="relative flex-1 max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
          <FiSearch size={16} />
        </span>
        <input
          type="text"
          placeholder="Search team member profiles by username or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
        />
      </div>

      {/* Dynamic Creation / Edit Input Console Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {editMode ? "Modify Operator Properties" : "Provision New Access Account"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <FiUser size={13} /> User Identity Handle
            </label>
            <input
              type="text"
              name="username"
              placeholder="e.g., operator_john"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all font-medium"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <FiMail size={13} /> Network Email Destination
            </label>
            <input
              type="email"
              name="email"
              placeholder="e.g., john.d@system.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all font-medium"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={editMode ? handleUpdate : handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 transition-all active:scale-[0.98]"
          >
            {editMode ? "Commit State Changes" : "Register Operator Unit"}
          </button>
          {editMode && (
            <button
              onClick={() => {
                setEditMode(false);
                setFormData({ username: "", email: "" });
              }}
              className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Discard
            </button>
          )}
        </div>
      </div>

      {/* Staff Ledger Table View */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Account Username</th>
                <th className="px-6 py-3.5">Assigned Corporate Email</th>
                <th className="px-6 py-3.5 text-right">System Configuration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {staff.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-12 text-slate-400 dark:text-slate-500 font-medium">
                    No active operator identities assigned inside current schema.
                  </td>
                </tr>
              ) : (
                staff.map((member) => (
                  <tr key={member._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 group transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                      <div className="w-7 h-7 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-xs font-bold text-slate-500 uppercase">
                        {member.username.substring(0, 2)}
                      </div>
                      <span>{member.username}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-300">{member.email}</td>
                    <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(member)}
                        className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 p-2 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg inline-flex items-center transition-colors text-xs font-bold gap-1"
                        title="Edit Operator Profile"
                      >
                        <FiEdit2 size={13} /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(member)}
                        className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg inline-flex items-center transition-colors text-xs font-bold gap-1"
                        title="Revoke Node Privileges"
                      >
                        <FiTrash2 size={13} /> Revoke
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revocation Security Modal Dialog Overlay */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-xl max-w-sm w-full space-y-4 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <FiAlertTriangle size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Revoke Account Nodes</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Are you absolutely sure you want to terminate system access for operator instance <strong>{deleteTarget.username}</strong>? This destroys target session identities immediately.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2 w-full justify-center">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors w-1/2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-semibold bg-rose-600 text-white rounded-xl hover:bg-rose-700 shadow-md shadow-rose-500/10 transition-colors w-1/2"
              >
                Confirm Revoke
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;