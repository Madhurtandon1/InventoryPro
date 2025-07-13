import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import toast from "react-hot-toast";

const ResetAdminPasscode = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPasscode, setNewPasscode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/users/reset-admin-passcode/${token}`, {
        newPasscode,
      });
      toast.success("Admin passcode has been reset");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow mt-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        🔁 Reset Admin Passcode
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          className="w-full border border-gray-300 px-4 py-2 rounded mb-4 text-gray-800"
          placeholder="Enter new admin passcode"
          value={newPasscode}
          onChange={(e) => setNewPasscode(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
        >
          Reset Passcode
        </button>
      </form>
    </div>
  );
};

export default ResetAdminPasscode;
