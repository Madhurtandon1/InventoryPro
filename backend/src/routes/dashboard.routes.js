import express from "express";
import {
  getDashboardSummary,
  getSalesTrend,
  getTopSellingProducts
} from "../controllers/dashboard.controller.js";

import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";

const router = express.Router();

// ✅ Accessible to both shop owner (admin) and employee (user)
router.get("/summary", verifyJWT, getDashboardSummary);

// 🔐 Owner-only insights (admin)
router.get("/trend", verifyJWT, getSalesTrend);
router.get("/top-products", verifyJWT, getTopSellingProducts);

export default router;
