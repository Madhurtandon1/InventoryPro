// import { useAuth } from "../context/AuthContext";
// import React from "react";
// import { useNavigate } from "react-router-dom";

// export default function Header() {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/"); // Make sure your route is defined as "/home" in your router
//   };

//   return (
//     <header className="bg-gray-800 shadow px-6 py-4 flex justify-between items-center">
//       <div className="flex items-center gap-4">
//         <span className="text-gray-100">Hello, {user?.username}</span>
//         <button
//           className="bg-red-500 text-white px-3 py-1 rounded"
//           onClick={handleLogout}
//         >
//           Logout
//         </button>
//       </div>
//     </header>
//   );
// }



import { useAuth } from "../context/AuthContext";
import React from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiUser } from "react-icons/fi";

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); 
  };

  // Check if they are admin or worker to greet them simply
  const displayRole = user?.role === "admin" ? "Owner" : "Staff";

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center shadow-sm transition-colors duration-200">
      
      {/* Branding Node / App Name */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          I
        </div>
        <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-sm">
          Inventory<span className="text-blue-600 dark:text-blue-500">Pro</span>
        </span>
      </div>

      {/* User Information & Actions Panel */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 px-3 py-1.5 rounded-xl">
          <FiUser className="text-slate-400" size={14} />
          <span>
            Hello, <span className="font-bold text-slate-900 dark:text-white">{user?.username || displayRole}</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded ml-1">
            {displayRole}
          </span>
        </div>

        <button
          className="bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 font-semibold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-150 active:scale-[0.97]"
          onClick={handleLogout}
          title="Sign out of system"
        >
          <FiLogOut size={13} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}