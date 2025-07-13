// src/components/LoginModal.jsx
import React, { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Lock } from "lucide-react";

export default function LoginModal({ onClose }) {
  const [data, setData] = useState({
    username: "",
    password: "",
    role: "admin",
    adminPasscode: "",
  });

  const [error, setError] = useState("");
  const { fetchProfile } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        username: data.username,
        password: data.password,
        role: data.role,
      };
      if (data.role === "admin") payload.adminPasscode = data.adminPasscode;

      const res = await api.post("/users/login", payload);
      const token = res.data?.data?.accessToken;
      if (!token) throw new Error("Access token not found");

      localStorage.setItem("token", token);
      await fetchProfile();

      const role = res.data?.data?.user?.role;
      if (role === "admin" || role === "staff") {
        window.location.href = "/dashboard"; // since we’re not in a route
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    }
  };

 return (
  <div
  className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
  <div className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-full max-w-md relative">
      <button onClick={onClose} className="absolute top-2 right-3 text-xl">
        ×
      </button>

      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <Lock size={24} className="text-yellow-400" />
        Login to InventoryPro
      </h2>

      {error && (
        <div className="mb-4 text-red-500 bg-red-100 border border-red-400 rounded px-4 py-2 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 text-sm text-gray-300">Username</label>
          <input
            type="text"
            name="username"
            value={data.username}
            onChange={(e) => setData({ ...data, username: e.target.value })}
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-300">Password</label>
          <input
            type="password"
            name="password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-300">Role</label>
          <select
            name="role"
            value={data.role}
            onChange={(e) => setData({ ...data, role: e.target.value })}
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white"
          >
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>
        </div>

        {data.role === "admin" && (
          <div>
            <label className="block mb-1 text-sm text-gray-300">Admin Passcode</label>
            <input
              type="text"
              value={data.adminPasscode}
              onChange={(e) =>
                setData({ ...data, adminPasscode: e.target.value })
              }
              className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white"
              required
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition"
        >
          🔐 Login
        </button>
      </form>
      <div className="flex justify-between text-sm mt-4">
  <button
    type="button"
    onClick={() => {
      onClose();
      window.location.href = "/forgot-password";
    }}
    className="text-blue-400 hover:underline"
  >
    Forgot Password?
  </button>

  <button
    type="button"
    onClick={() => {
      onClose();
      window.location.href = "/forgot-admin-passcode";
    }}
    className="text-blue-400 hover:underline"
  >
    Forgot Admin Passcode?
  </button>
</div>

    </div>
  </div>
);


}
