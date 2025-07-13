import React, { useState } from "react";
import axios from "../utils/axios";
import toast from "react-hot-toast";

const ForgotAdminPasscode = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/users/forgot-admin-passcode", { email });
      toast.success("Reset link sent to your email");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset link");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-400">
            <div className="bg-gray-700 text-white p-8 rounded-xl shadow-lg w-full max-w-md">

      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">🔐 Forgot Admin Passcode</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="w-full border border-gray-300 px-4 py-2 rounded mb-4 text-gray-100"
          placeholder="Enter your admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Send Reset Link
        </button>
      </form>
    </div>
    </div>
  );
};

export default ForgotAdminPasscode;
