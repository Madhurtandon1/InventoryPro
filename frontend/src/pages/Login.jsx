// // src/components/LoginModal.jsx
// import React, { useState } from "react";
// import api from "../services/api";
// import { useAuth } from "../context/AuthContext";
// import { Lock } from "lucide-react";

// export default function LoginModal({ onClose }) {
//   const [data, setData] = useState({
//     username: "",
//     password: "",
//     role: "admin",
//     adminPasscode: "",
//   });

//   const [error, setError] = useState("");
//   const { fetchProfile } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const payload = {
//         username: data.username,
//         password: data.password,
//         role: data.role,
//       };
//       if (data.role === "admin") payload.adminPasscode = data.adminPasscode;

//       const res = await api.post("/users/login", payload);
//       const token = res.data?.data?.accessToken;
//       if (!token) throw new Error("Access token not found");

//       localStorage.setItem("token", token);
//       await fetchProfile();

//       const role = res.data?.data?.user?.role;
//       if (role === "admin" || role === "staff") {
//         window.location.href = "/dashboard"; // since we’re not in a route
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || "Login failed");
//     }
//   };

//  return (
//   <div
//   className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
//     onClick={(e) => e.target === e.currentTarget && onClose()}
//   >
//   <div className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-full max-w-md relative">
//       <button onClick={onClose} className="absolute top-2 right-3 text-xl">
//         ×
//       </button>

//       <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
//         <Lock size={24} className="text-yellow-400" />
//         Login to InventoryPro
//       </h2>

//       {error && (
//         <div className="mb-4 text-red-500 bg-red-100 border border-red-400 rounded px-4 py-2 text-sm">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-5">
//         <div>
//           <label className="block mb-1 text-sm text-gray-300">Username</label>
//           <input
//             type="text"
//             name="username"
//             value={data.username}
//             onChange={(e) => setData({ ...data, username: e.target.value })}
//             className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white"
//             required
//           />
//         </div>

//         <div>
//           <label className="block mb-1 text-sm text-gray-300">Password</label>
//           <input
//             type="password"
//             name="password"
//             value={data.password}
//             onChange={(e) => setData({ ...data, password: e.target.value })}
//             className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white"
//             required
//           />
//         </div>

//         <div>
//           <label className="block mb-1 text-sm text-gray-300">Role</label>
//           <select
//             name="role"
//             value={data.role}
//             onChange={(e) => setData({ ...data, role: e.target.value })}
//             className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white"
//           >
//             <option value="admin">Admin</option>
//             <option value="staff">Staff</option>
//           </select>
//         </div>

//         {data.role === "admin" && (
//           <div>
//             <label className="block mb-1 text-sm text-gray-300">Admin Passcode</label>
//             <input
//               type="text"
//               value={data.adminPasscode}
//               onChange={(e) =>
//                 setData({ ...data, adminPasscode: e.target.value })
//               }
//               className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white"
//               required
//             />
//           </div>
//         )}

//         <button
//           type="submit"
//           className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition"
//         >
//           🔐 Login
//         </button>
//       </form>
//       <div className="flex justify-between text-sm mt-4">
//   <button
//     type="button"
//     onClick={() => {
//       onClose();
//       window.location.href = "/forgot-password";
//     }}
//     className="text-blue-400 hover:underline"
//   >
//     Forgot Password?
//   </button>

//   <button
//     type="button"
//     onClick={() => {
//       onClose();
//       window.location.href = "/forgot-admin-passcode";
//     }}
//     className="text-blue-400 hover:underline"
//   >
//     Forgot Admin Passcode?
//   </button>
// </div>

//     </div>
//   </div>
// );


// }



import React, { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { FiLock, FiX, FiUser, FiShield, FiKey } from "react-icons/fi";

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
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <style>{`
        :root {
          --brand-blue: oklch(54.6% 0.245 262.881);
          --brand-blue-hover: oklch(50% 0.24 262.881);
        }
      `}</style>

      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-md relative transition-colors duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <FiX size={18} />
        </button>

        {/* Heading Title */}
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-600 dark:text-blue-500">
              <FiLock size={20} />
            </div>
            <span>Log In to Your Shop</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
            Enter your details below to open your shop dashboard.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 text-xs font-semibold bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 px-4 py-2.5 rounded-xl flex items-center gap-2">
            <FiShield className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username Input Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <FiUser className="text-slate-400" /> Your Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={data.username}
              onChange={(e) => setData({ ...data, username: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
              placeholder="e.g. Madhur Tandon"
              required
            />
          </div>

          {/* Password Input Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <FiKey className="text-slate-400" /> Password <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Role Selection Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <FiShield className="text-slate-400" /> Who are you? <span className="text-rose-500">*</span>
            </label>
            <select
              name="role"
              value={data.role}
              onChange={(e) => setData({ ...data, role: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors font-medium cursor-pointer"
            >
              <option value="admin">Shop Owner (Admin)</option>
              <option value="staff">Staff / Worker</option>
            </select>
          </div>

          {/* Conditional Passcode Input Field */}
          {data.role === "admin" && (
            <div className="space-y-1.5 animate-slideDown">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FiLock className="text-slate-400" /> Secret Key / Passcode <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                value={data.adminPasscode}
                onChange={(e) =>
                  setData({ ...data, adminPasscode: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-mono tracking-widest"
                placeholder="Enter shop security code"
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 px-4 rounded-xl shadow-lg shadow-blue-500/15 flex items-center justify-center gap-2 transition-all mt-6 active:scale-[0.98]"
          >
            Log In Now
          </button>
        </form>

        {/* Footer Links */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-xs font-medium mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={() => {
              onClose();
              window.location.href = "/forgot-password";
            }}
            className="text-blue-600 dark:text-blue-400 hover:underline text-left"
          >
            Forgot Password?
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              window.location.href = "/forgot-admin-passcode";
            }}
            className="text-blue-600 dark:text-blue-400 hover:underline text-left"
          >
            Forgot Secret Key?
          </button>
        </div>

      </div>
    </div>
  );
}