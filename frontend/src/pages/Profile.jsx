import React, { useEffect, useState } from "react";
import axios from "../utils/axios.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [adminPasscodeForm, setAdminPasscodeForm] = useState({
  oldPasscode: "",
  newPasscode: "",
});


  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data.data;

      // Allow only admin to view this page
      if (data.role !== "admin") {
        toast.error("Access denied");
        return navigate("/");
      }

      setProfile(data);
      setForm({ name: data.username, email: data.email });
    } catch (err) {
      toast.error("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "/users/update-account",
        { username: form.name, email: form.email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Profile updated");
      setProfile(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setChangingPassword(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put("/users/change-password", passwordForm, {
  headers: { Authorization: `Bearer ${token}` },
});

      toast.success("Password changed");
      setPasswordForm({ oldPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleAdminPasswordChange = async (e) => {
  e.preventDefault();
  setChangingPassword(true);
  try {
    const token = localStorage.getItem("token");
    await axios.put("/users/update-admin-passcode", adminPasscodeForm, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Admin passcode changed");
    setAdminPasscodeForm({ oldPasscode: "", newPasscode: "" });
  } catch (err) {
    toast.error(err.response?.data?.message || "Admin passcode change failed");
  } finally {
    setChangingPassword(false);
  }
};


  if (loading) return <p className="p-4">Loading profile...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-6">👤 Admin Profile</h1>

      <form onSubmit={handleUpdate} className="mb-8 space-y-4">
        <div>
          <label className="block font-medium">Username</label>
          <input
            type="text"
            className="w-full border border-gray-300 px-4 py-2 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 px-4 py-2 rounded"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={updating}
        >
          {updating ? "Updating..." : "Update Profile"}
        </button>
      </form>

      <hr className="mb-6" />

      <form onSubmit={handlePasswordChange} className="space-y-4">
        <h2 className="text-lg font-semibold">🔒 Change Password</h2>
        <div>
          <label className="block font-medium">Old Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 px-4 py-2 rounded"
            value={passwordForm.oldPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block font-medium">New Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 px-4 py-2 rounded"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, newPassword: e.target.value })
            }
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={changingPassword}
        >
          {changingPassword ? "Changing..." : "Change Password"}
        </button>
      </form>


      <form onSubmit={handleAdminPasswordChange} className="space-y-4 mt-6">
  <h2 className="text-lg font-semibold">🔐 Change Admin Passcode</h2>
  <div>
    <label className="block font-medium">Old Admin Passcode</label>
    <input
      type="password"
      className="w-full border border-gray-300 px-4 py-2 rounded"
      value={adminPasscodeForm.oldPasscode}
      onChange={(e) =>
        setAdminPasscodeForm({
          ...adminPasscodeForm,
          oldPasscode: e.target.value,
        })
      }
      required
    />
  </div>
  <div>
    <label className="block font-medium">New Admin Passcode</label>
    <input
      type="password"
      className="w-full border border-gray-300 px-4 py-2 rounded"
      value={adminPasscodeForm.newPasscode}
      onChange={(e) =>
        setAdminPasscodeForm({
          ...adminPasscodeForm,
          newPasscode: e.target.value,
        })
      }
      required
    />
  </div>
  <button
    type="submit"
    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
    disabled={changingPassword}
  >
    {changingPassword ? "Changing..." : "Change Admin Passcode"}
  </button>
      </form>

    </div>
  );
};

export default Profile;
