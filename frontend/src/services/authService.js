import axiosInstance from "../utils/axios.js";

// 🔐 Auth Functions
export const loginUser = (data) => axiosInstance.post("/users/login", data);



export const registerUser = (data) => axiosInstance.post("/users/register", data); // NOT just "/register"
export const logoutUser = () => axiosInstance.post("/users/logout");

// 🧑‍💼 Profile
export const getProfile = () => axiosInstance.get("/users/profile");
export const updateAccount = (data) => axiosInstance.put("/users/update-account", data);
export const changePassword = (data) => axiosInstance.post("/users/change-password", data);

// 🔁 Token refresh
export const refreshToken = () => axiosInstance.post("/users/refresh-token");

// 🔑 Forgot & Reset Password
export const forgotPassword = (data) => axiosInstance.post("/users/forgot-password", data);
export const resetPassword = (data, token) =>
  axiosInstance.post(`/users/reset-password/${token}`, data);

export default {
  loginUser,
  registerUser,
  logoutUser,
  getProfile,
  updateAccount,
  changePassword,
  refreshToken,
  forgotPassword,
  resetPassword,
};
