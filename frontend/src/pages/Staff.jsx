import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { Toaster, toast } from "react-hot-toast";

const Staff = () => {
  const token = localStorage.getItem("token");
  const [staff, setStaff] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null); // 🧠 track item to delete

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

  const handleEdit = (staff) => {
    setEditMode(true);
    setEditingId(staff._id);
    setFormData({ username: staff.username, email: staff.email });
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
    <div className="p-6 max-w-7xl mx-auto">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          🧑‍🤝‍🧑 My Staff ({total})
        </h1>
      </div>

      {/* 🔍 Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search staff by username or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 border px-4 py-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ➕ Add / ✏️ Edit Form */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          {editMode ? " Edit Staff" : "➕ Add Staff Member"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {["username", "email"].map((field) => (
            <input
              key={field}
              type={field === "email" ? "email" : "text"}
              name={field}
              placeholder={field === "username" ? "👤 Username" : "📧 Email"}
              value={formData[field]}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <div className="mt-4 flex gap-4">
          <button
            onClick={editMode ? handleUpdate : handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium"
          >
            {editMode ? "Update Staff" : "Add Staff"}
          </button>
          {editMode && (
            <button
              onClick={() => {
                setEditMode(false);
                setFormData({ username: "", email: "" });
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* 👨‍💼 Staff Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border text-sm">
          <thead className=" dark:bg-gray-800 text-gray-800 dark:text-white">
            <tr>
              <th className="px-4 py-3 border">👤 Username</th>
              <th className="px-4 py-3 border">📧 Email</th>
              <th className="px-4 py-3 border">⚙️ Actions</th>
            </tr>
          </thead>
          <tbody className=" dark:text-gray-600">
            {staff.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-600">
                  No staff found.
                </td>
              </tr>
            ) : (
              staff.map((member) => (
                <tr
                  key={member._id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-4 py-2 border font-medium">{member.username}</td>
                  <td className="px-4 py-2 border">{member.email}</td>
                  <td className="px-4 py-2 border space-x-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="text-yellow-600 hover:underline"
                    >
                       Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(member)}
                      className="text-red-600 hover:underline"
                    >
                       Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🧨 Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              ⚠️ Confirm Deletion
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Are you sure you want to delete staff member{" "}
              <span className="font-bold">{deleteTarget.username}</span>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
