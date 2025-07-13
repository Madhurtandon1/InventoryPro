// src/components/DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import Header from "./Header.jsx"
import Sidebar from "./Sidebar.jsx";
import React from "react";

export default function DashboardLayout() {
  return (
<div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
