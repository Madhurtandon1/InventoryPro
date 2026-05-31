// import React, { useState } from "react";
// import axios from "../utils/axios.js";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";

// const Register = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     adminPasscode: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await axios.post("/users/register", formData);

//       toast.success("Admin account created! You can now log in.");
//       setFormData({ username: "", email: "", password: "", adminPasscode: "" });
//       navigate("/login");
//     } catch (err) {
//       console.error(err);
//       const message =
//         err.response?.data?.message || "Registration failed. Please try again.";
//       toast.error(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
//       <div className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-center">
//           Create Admin Account
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <input
//             type="text"
//             name="username"
//             placeholder="Username"
//             className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
//             value={formData.username}
//             onChange={handleChange}
//             required
//             disabled={loading}
//           />

//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             disabled={loading}
//           />

//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             disabled={loading}
//           />

//           <input
//             type="text"
//             name="adminPasscode"
//             placeholder="Admin Passcode"
//             className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
//             value={formData.adminPasscode}
//             onChange={handleChange}
//             required
//             disabled={loading}
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-3 rounded-md text-white font-semibold transition ${
//               loading
//                 ? "bg-blue-400 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             {loading ? "Creating Admin..." : "Register as Admin"}
//           </button>
//         </form>

//         <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
//           Already have an account?{" "}
//           <span
//             onClick={() => navigate("/login")}
//             className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
//           >
//             Login
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;





import React, { useState } from "react";
import axios from "../utils/axios.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiUserPlus, FiUser, FiMail, FiKey, FiLock, FiLoader } from "react-icons/fi";

const Register = () => {
  const navigate = useNavigate();

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
      navigate("/login");
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
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-200 overflow-y-auto">
      <style>{`
        :root {
          --brand-blue: oklch(54.6% 0.245 262.881);
          --brand-blue-hover: oklch(50% 0.24 262.881);
        }
      `}</style>

      {/* Main Container Card */}
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-md transition-all duration-200">
        
        {/* Title Group Module */}
        <div className="mb-6 text-center sm:text-left">
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-600 dark:text-blue-500">
              <FiUserPlus size={20} />
            </div>
            <span>Create Admin Workspace</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
            Provision primary administrative cryptographic profiles onto the localized core master network.
          </p>
        </div>

        {/* Entry Registration Form Matrix */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username Input Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <FiUser className="text-slate-400" /> Account Identity
            </label>
            <input
              type="text"
              name="username"
              placeholder="e.g., admin_tandon"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-medium disabled:opacity-50"
              required
            />
          </div>

          {/* Email Input Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <FiMail className="text-slate-400" /> Network Email Destination
            </label>
            <input
              type="email"
              name="email"
              placeholder="e.g., corporate@inventorypro.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-medium disabled:opacity-50"
              required
            />
          </div>

          {/* Password Input Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <FiKey className="text-slate-400" /> Secure Passphrase
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-medium disabled:opacity-50"
              required
            />
          </div>

          {/* Admin Token Passcode Input Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <FiLock className="text-slate-400" /> Security Admin Passcode
            </label>
            <input
              type="password"
              name="adminPasscode"
              placeholder="Enter system deployment passcode..."
              value={formData.adminPasscode}
              onChange={handleChange}
              disabled={loading}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-mono tracking-widest disabled:opacity-50"
              required
            />
          </div>

          {/* Action Trigger Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 px-4 rounded-xl shadow-lg shadow-blue-500/15 flex items-center justify-center gap-2 transition-all mt-6 active:scale-[0.98] ${
              loading ? "opacity-70 cursor-not-allowed shadow-none" : ""
            }`}
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" size={16} />
                <span>Initializing System Node...</span>
              </>
            ) : (
              <span>Deploy Administrative Node</span>
            )}
          </button>
        </form>

        {/* Footer Redirect Options */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
          Already verified inside workspace registry?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
          >
            Authenticate Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;