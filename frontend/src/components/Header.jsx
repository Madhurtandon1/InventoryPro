import { useAuth } from "../context/AuthContext";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Make sure your route is defined as "/home" in your router
  };

  return (
    <header className="bg-gray-800 shadow px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <span className="text-gray-100">Hello, {user?.username}</span>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

