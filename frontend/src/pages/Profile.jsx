// import React, { useEffect, useState } from "react";
// import axios from "../utils/axios.js";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// const Profile = () => {
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);
//   const [changingPassword, setChangingPassword] = useState(false);
//   const [form, setForm] = useState({ name: "", email: "" });
//   const [passwordForm, setPasswordForm] = useState({
//     oldPassword: "",
//     newPassword: "",
//   });
//   const [adminPasscodeForm, setAdminPasscodeForm] = useState({
//   oldPasscode: "",
//   newPasscode: "",
// });


//   const fetchProfile = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("/users/profile", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = res.data.data;

//       // Allow only admin to view this page
//       if (data.role !== "admin") {
//         toast.error("Access denied");
//         return navigate("/");
//       }

//       setProfile(data);
//       setForm({ name: data.username, email: data.email });
//     } catch (err) {
//       toast.error("Failed to fetch profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     setUpdating(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.put(
//         "/users/update-account",
//         { username: form.name, email: form.email },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       toast.success("Profile updated");
//       setProfile(res.data.data);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Update failed");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handlePasswordChange = async (e) => {
//     e.preventDefault();
//     setChangingPassword(true);
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put("/users/change-password", passwordForm, {
//   headers: { Authorization: `Bearer ${token}` },
// });

//       toast.success("Password changed");
//       setPasswordForm({ oldPassword: "", newPassword: "" });
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Password change failed");
//     } finally {
//       setChangingPassword(false);
//     }
//   };

//   const handleAdminPasswordChange = async (e) => {
//   e.preventDefault();
//   setChangingPassword(true);
//   try {
//     const token = localStorage.getItem("token");
//     await axios.put("/users/update-admin-passcode", adminPasscodeForm, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     toast.success("Admin passcode changed");
//     setAdminPasscodeForm({ oldPasscode: "", newPasscode: "" });
//   } catch (err) {
//     toast.error(err.response?.data?.message || "Admin passcode change failed");
//   } finally {
//     setChangingPassword(false);
//   }
// };


//   if (loading) return <p className="p-4">Loading profile...</p>;

//   return (
//     <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
//       <h1 className="text-2xl font-semibold mb-6">👤 Admin Profile</h1>

//       <form onSubmit={handleUpdate} className="mb-8 space-y-4">
//         <div>
//           <label className="block font-medium">Username</label>
//           <input
//             type="text"
//             className="w-full border border-gray-300 px-4 py-2 rounded"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//             required
//           />
//         </div>
//         <div>
//           <label className="block font-medium">Email</label>
//           <input
//             type="email"
//             className="w-full border border-gray-300 px-4 py-2 rounded"
//             value={form.email}
//             onChange={(e) => setForm({ ...form, email: e.target.value })}
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           disabled={updating}
//         >
//           {updating ? "Updating..." : "Update Profile"}
//         </button>
//       </form>

//       <hr className="mb-6" />

//       <form onSubmit={handlePasswordChange} className="space-y-4">
//         <h2 className="text-lg font-semibold">🔒 Change Password</h2>
//         <div>
//           <label className="block font-medium">Old Password</label>
//           <input
//             type="password"
//             className="w-full border border-gray-300 px-4 py-2 rounded"
//             value={passwordForm.oldPassword}
//             onChange={(e) =>
//               setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
//             }
//             required
//           />
//         </div>
//         <div>
//           <label className="block font-medium">New Password</label>
//           <input
//             type="password"
//             className="w-full border border-gray-300 px-4 py-2 rounded"
//             value={passwordForm.newPassword}
//             onChange={(e) =>
//               setPasswordForm({ ...passwordForm, newPassword: e.target.value })
//             }
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//           disabled={changingPassword}
//         >
//           {changingPassword ? "Changing..." : "Change Password"}
//         </button>
//       </form>


//       <form onSubmit={handleAdminPasswordChange} className="space-y-4 mt-6">
//   <h2 className="text-lg font-semibold">🔐 Change Admin Passcode</h2>
//   <div>
//     <label className="block font-medium">Old Admin Passcode</label>
//     <input
//       type="password"
//       className="w-full border border-gray-300 px-4 py-2 rounded"
//       value={adminPasscodeForm.oldPasscode}
//       onChange={(e) =>
//         setAdminPasscodeForm({
//           ...adminPasscodeForm,
//           oldPasscode: e.target.value,
//         })
//       }
//       required
//     />
//   </div>
//   <div>
//     <label className="block font-medium">New Admin Passcode</label>
//     <input
//       type="password"
//       className="w-full border border-gray-300 px-4 py-2 rounded"
//       value={adminPasscodeForm.newPasscode}
//       onChange={(e) =>
//         setAdminPasscodeForm({
//           ...adminPasscodeForm,
//           newPasscode: e.target.value,
//         })
//       }
//       required
//     />
//   </div>
//   <button
//     type="submit"
//     className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
//     disabled={changingPassword}
//   >
//     {changingPassword ? "Changing..." : "Change Admin Passcode"}
//   </button>
//       </form>

//     </div>
//   );
// };

// export default Profile;




import React, { useEffect, useState } from "react";
import axios from "../utils/axios.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiKey, FiCheckCircle, FiRefreshCw, FiLoader } from "react-icons/fi";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [changingPasscode, setChangingPasscode] = useState(false);
  
  const [form, setForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "" });
  const [adminPasscodeForm, setAdminPasscodeForm] = useState({ oldPasscode: "", newPasscode: "" });

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.data;

      if (data.role !== "admin") {
        toast.error("Access denied");
        return navigate("/");
      }

      setProfile(data);
      setForm({ name: data.username, email: data.email });
    } catch (err) {
      toast.error("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "/users/update-account",
        { username: form.name, email: form.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profile updated cleanly");
      setProfile(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setChangingPassword(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put("/users/change-password", passwordForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Password changed successfully");
      setPasswordForm({ oldPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleAdminPasswordChange = async (e) => {
    e.preventDefault();
    setChangingPasscode(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put("/users/update-admin-passcode", adminPasscodeForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Admin passcode updated successfully");
      setAdminPasscodeForm({ oldPasscode: "", newPasscode: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Admin passcode change failed");
    } finally {
      setChangingPasscode(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4 space-y-3">
        <FiLoader className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">Loading profile...</p>
      </div>
    );
  }

  return (
    /* STRETCH CONTAINER: Uses w-full to fill the space cleanly */
    <div className="p-4 md:p-8 w-full min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Header Unit */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <FiUser className="text-blue-600 dark:text-blue-500" />
          <span>My Profile Settings</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage personal shop credentials, access security passwords, and primary system configuration attributes.
        </p>
      </div>

      <div className="space-y-6 mt-6 max-w-4xl">
        {/* Module 1: Shop Account Info */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <FiUser size={14} /> Basic Owner Account Info
          </h2>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Your Name</label>
                <input
                  type="text"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all font-medium"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Shop Email Address</label>
                <input
                  type="email"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all font-medium"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                disabled={updating}
              >
                {updating ? <FiRefreshCw className="animate-spin" size={12} /> : <FiCheckCircle size={12} />}
                <span>{updating ? "Saving..." : "Update Shop Profile"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Module 2: Change Password */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <FiKey size={14} /> Change Login Password
          </h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Current Password</label>
                <input
                  type="password"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all"
                  placeholder="••••••••••••"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">New Safe Password</label>
                <input
                  type="password"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all"
                  placeholder="Choose a new safe password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                disabled={changingPassword}
              >
                {changingPassword ? <FiRefreshCw className="animate-spin" size={12} /> : <FiKey size={12} />}
                <span>{changingPassword ? "Changing..." : "Save New Password"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Module 3: Change Secret Passcode */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <FiLock size={14} /> Change Security Secret Passcode
          </h2>
          <form onSubmit={handleAdminPasswordChange} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Current Secret Key</label>
                <input
                  type="password"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-blue-500 font-mono tracking-widest"
                  placeholder="••••"
                  value={adminPasscodeForm.oldPasscode}
                  onChange={(e) => setAdminPasscodeForm({ ...adminPasscodeForm, oldPasscode: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">New Security Secret Key</label>
                <input
                  type="password"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-blue-500 font-mono tracking-widest"
                  placeholder="••••"
                  value={adminPasscodeForm.newPasscode}
                  onChange={(e) => setAdminPasscodeForm({ ...adminPasscodeForm, newPasscode: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                disabled={changingPasscode}
              >
                {changingPasscode ? <FiRefreshCw className="animate-spin" size={12} /> : <FiLock size={12} />}
                <span>{changingPasscode ? "Changing..." : "Save New Secret Passcode"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;