// import React, { useState } from "react";
// import axios from "../utils/axios.js";
// import { toast } from "react-hot-toast";
// import { UserPlus } from "lucide-react";

// const Register2 = ({ onClose , openLogin}) => {
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
//       onClose(); // Close modal after successful registration
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
//     <div
//   className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//   <div className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-full max-w-md relative">
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-3 text-white text-xl hover:text-gray-300"
//         >
//           ×
//         </button>

//         <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 text-center justify-center">
//           <UserPlus className="text-yellow-400" size={24} />
//           Create Admin Account
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <input
//             type="text"
//             name="username"
//             placeholder="Username"
//             className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
//             value={formData.username}
//             onChange={handleChange}
//             required
//             disabled={loading}
//           />

//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             disabled={loading}
//           />

//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             disabled={loading}
//           />

//           <input
//             type="text"
//             name="adminPasscode"
//             placeholder="Admin Passcode"
//             className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
//             value={formData.adminPasscode}
//             onChange={handleChange}
//             required
//             disabled={loading}
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-2 rounded-md text-white font-semibold transition ${
//               loading
//                 ? "bg-yellow-400 cursor-not-allowed"
//                 : "bg-yellow-500 hover:bg-yellow-600"
//             }`}
//           >
//             {loading ? "Creating Admin..." : "Register as Admin"}
//           </button>
//         </form>

//         <div className="mt-6 text-center text-sm text-gray-400">
//           Already have an account?{" "}
//           <span
//   onClick={() => {
//     onClose();
//     openLogin(); // opens login modal after closing register
//   }}
//   className="text-yellow-400 hover:underline cursor-pointer font-semibold"
// >
//   Login
// </span>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register2;


import React, { useState } from "react";
import axios from "../utils/axios.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiUserPlus, FiX, FiUser, FiMail, FiKey, FiLock, FiLoader } from "react-icons/fi";

const Register2 = ({ onClose, openLogin }) => {
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

      toast.success("Account created successfully! You can now log in.");
      setFormData({ username: "", email: "", password: "", adminPasscode: "" });
      if (openLogin) {
        openLogin();
      } else {
        onClose();
      }
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
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

      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-md relative transition-all duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <FiX size={18} />
        </button>

        {/* Header Title */}
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-600 dark:text-blue-500">
              <FiUserPlus size={20} />
            </div>
            <span>Create Owner Account</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
            Register your shop to start managing your products, bills, and customers.
          </p>
        </div>

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
              placeholder="e.g. Madhur Tandon"
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
              <FiMail className="text-slate-400" /> Shop Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="e.g. myshop@gmail.com"
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
              <FiKey className="text-slate-400" /> Password <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Choose a safe password"
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
              <FiLock className="text-slate-400" /> Secret Key / Passcode <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              name="adminPasscode"
              placeholder="Enter your security passcode"
              value={formData.adminPasscode}
              onChange={handleChange}
              disabled={loading}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-mono tracking-widest disabled:opacity-50"
              required
            />
          </div>

          {/* Submit Button */}
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
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Register My Shop</span>
            )}
          </button>
        </form>

        {/* Footer Toggle Text */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
          Already registered?{" "}
          <span
            onClick={openLogin}
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
          >
            Log In here
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register2;