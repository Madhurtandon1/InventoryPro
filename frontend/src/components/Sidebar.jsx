import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Package,
  Users,
  ClipboardList,
  LogOut,
  PlusCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Base navigation (common for both admin and staff)
  const navItems = [
    { to: "/dashboard", icon: <Home size={20} />, label: "Dashboard" },
    { to: "/products", icon: <Package size={20} />, label: "Products" },
    { to: "/customers", icon: <Users size={20} />, label: "Customers" },
    { to: "/orders", icon: <ClipboardList size={20} />, label: "Orders" },
    { to: "/orders/add", icon: <PlusCircle size={20} />, label: "Add Order" },
    

  ];

  // Only for admin users
  if (user?.role === "admin") {
    navItems.push({
      to: "/staff",
      icon: <Users size={20} />,
      label: "My Staff",
    });
    navItems.push({
      to: "/profile",
      icon: <Users size={20} />,
      label: "My Profile",
    });
  }

  return (
    <div className="h-screen w-64 bg-gray-800 text-gray-200 flex flex-col shadow-lg">
      <div className="p-5 font-bold text-2xl tracking-wide border-b border-gray-700">
        🧾 InventoryPro
      </div>

      <nav className="flex-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-3 px-4 py-2 rounded-md mb-2 transition-all no-underline ${
              location.pathname === item.to
                ? "bg-gray-700 text-white"
                : "text-gray-200 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <span className="text-inherit">{item.icon}</span>
            <span className="text-inherit">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full text-left px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
