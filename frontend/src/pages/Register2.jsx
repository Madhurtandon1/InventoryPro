import React, { useState } from "react";
import axios from "../utils/axios.js";
import { toast } from "react-hot-toast";
import { UserPlus } from "lucide-react";

const Register2 = ({ onClose , openLogin}) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    adminPasscode: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/users/register", formData);
      toast.success("Admin account created! You can now log in.");
      setFormData({ username: "", email: "", password: "", adminPasscode: "" });
      onClose(); // Close modal after successful registration
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
  className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
  <div className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-white text-xl hover:text-gray-300"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 text-center justify-center">
          <UserPlus className="text-yellow-400" size={24} />
          Create Admin Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <input
            type="text"
            name="adminPasscode"
            placeholder="Admin Passcode"
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={formData.adminPasscode}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white font-semibold transition ${
              loading
                ? "bg-yellow-400 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {loading ? "Creating Admin..." : "Register as Admin"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <span
  onClick={() => {
    onClose();
    openLogin(); // opens login modal after closing register
  }}
  className="text-yellow-400 hover:underline cursor-pointer font-semibold"
>
  Login
</span>

        </div>
      </div>
    </div>
  );
};

export default Register2;
