// import React from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   Home,
//   Package,
//   Users,
//   ClipboardList,
//   LogOut,
//   PlusCircle,
// } from "lucide-react";
// import { useAuth } from "../context/AuthContext";

// const Sidebar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const logout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   // Base navigation (common for both admin and staff)
//   const navItems = [
//     { to: "/dashboard", icon: <Home size={20} />, label: "Dashboard" },
//     { to: "/products", icon: <Package size={20} />, label: "Products" },
//     { to: "/customers", icon: <Users size={20} />, label: "Customers" },
//     { to: "/orders", icon: <ClipboardList size={20} />, label: "Orders" },
//     { to: "/orders/add", icon: <PlusCircle size={20} />, label: "Add Order" },
    

//   ];

//   // Only for admin users
//   if (user?.role === "admin") {
//     navItems.push({
//       to: "/staff",
//       icon: <Users size={20} />,
//       label: "My Staff",
//     });
//     navItems.push({
//       to: "/profile",
//       icon: <Users size={20} />,
//       label: "My Profile",
//     });
//   }

//   return (
//     <div className="h-screen w-64 bg-gray-800 text-gray-200 flex flex-col shadow-lg">
//       <div className="p-5 font-bold text-2xl tracking-wide border-b border-gray-700">
//         🧾 InventoryPro
//       </div>

//       <nav className="flex-1 p-4">
//         {navItems.map((item) => (
//           <Link
//             key={item.to}
//             to={item.to}
//             className={`flex items-center gap-3 px-4 py-2 rounded-md mb-2 transition-all no-underline ${
//               location.pathname === item.to
//                 ? "bg-gray-700 text-white"
//                 : "text-gray-200 hover:bg-gray-700 hover:text-white"
//             }`}
//           >
//             <span className="text-inherit">{item.icon}</span>
//             <span className="text-inherit">{item.label}</span>
//           </Link>
//         ))}
//       </nav>

//       <div className="p-4 border-t border-gray-700">
//         <button
//           onClick={logout}
//           className="flex items-center gap-2 w-full text-left px-4 py-2 rounded-md hover:bg-red-600 transition"
//         >
//           <LogOut size={20} />
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;



import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiBox, FiUsers, FiFileText, FiPlusCircle, FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Base navigation (simple everyday language for shopkeepers and workers)
  const navItems = [
    { to: "/dashboard", icon: <FiHome size={18} />, label: "Dashboard" },
    { to: "/products", icon: <FiBox size={18} />, label: "Products" },
    { to: "/customers", icon: <FiUsers size={18} />, label: "Customers" },
    { to: "/orders", icon: <FiFileText size={18} />, label: "All Bills / Orders" },
    { to: "/orders/add", icon: <FiPlusCircle size={18} />, label: "Create New Bill" },
  ];

  // Only show these choices if the logged-in user is the Shop Owner (Admin)
  if (user?.role === "admin") {
    navItems.push({
      to: "/staff",
      icon: <FiUsers size={18} />,
      label: "Manage Staff",
    });
    navItems.push({
      to: "/profile",
      icon: <FiUser size={18} />,
      label: "My Profile",
    });
  }

  return (
    <div className="h-screen w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shadow-xl select-none">
      
      {/* Upper Brand Branding Banner */}
      <div className="p-5 flex items-center gap-2 border-b border-slate-800">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
          I
        </div>
        <span className="font-extrabold tracking-tight text-white text-lg">
          Inventory<span className="text-blue-500">Pro</span>
        </span>
      </div>

      {/* Navigation Options Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all no-underline ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
              }`}
            >
              <span className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer System Exit Trigger */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-all border border-transparent hover:border-rose-900/30"
        >
          <FiLogOut size={18} />
          <span>Logout From Shop</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;