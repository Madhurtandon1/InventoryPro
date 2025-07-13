// src/routes/user.routes.js

import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getProfile,
  changePassword,
  updateAccountDetails,
  forgotPassword,
  resetPassword,
  forgotAdminPasscode,
  resetAdminPasscode,
  updateAdminPasscode,
  deleteAccount,
  registerStaff,
  getMyStaff,
  updateStaff,
  deleteStaff
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";


const router = express.Router();

router.post("/register", registerUser); // admin adds employee
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/forgot-password", forgotPassword);

router.get("/profile", verifyJWT, getProfile);
router.post("/logout", verifyJWT, logoutUser);
router.post("/forgot-password", forgotPassword); // no auth required
router.post("/reset-password/:token", resetPassword); // no auth required
router.post("/forgot-admin-passcode", forgotAdminPasscode);
router.post("/reset-admin-passcode/:token", resetAdminPasscode);



router.put("/update-account", verifyJWT, authorizeRoles("admin"), updateAccountDetails);
router.put("/change-password", verifyJWT, authorizeRoles("admin"), changePassword);
router.delete("/delete-account", verifyJWT, authorizeRoles("admin"), deleteAccount);
router.put("/update-admin-passcode", verifyJWT, authorizeRoles("admin"), updateAdminPasscode );

router.post("/register-staff", verifyJWT, authorizeRoles("admin"), registerStaff);
router.get("/staff", verifyJWT, authorizeRoles("admin"), getMyStaff);
router.put("/staff/:id", verifyJWT, authorizeRoles("admin"), updateStaff);
router.delete("/staff/:id", verifyJWT, authorizeRoles("admin"), deleteStaff);


export default router;
