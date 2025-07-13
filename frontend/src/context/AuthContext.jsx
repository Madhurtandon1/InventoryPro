// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Wrap setUser to also save in localStorage
  const setUser = (userData) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
    setUserState(userData);
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchedUser = res.data.data;
      setUser(fetchedUser);
    } catch (err) {
      console.error("❌ Failed to fetch profile:", err?.response?.data?.message || err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUserState(JSON.parse(savedUser));
      setLoading(false);
    } else {
      fetchProfile(); // fallback to server
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
