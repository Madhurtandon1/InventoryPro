// src/routes/product.routes.js

import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  getProductById,
  getLowStockProducts,
  getOutOfStockProducts,
  updateStock,
  getAllCategories,
} from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Secure all routes with JWT
router.use(verifyJWT);

// 📦 ADMIN ROUTES
router.post("/", authorizeRoles("admin"), upload.fields([{ name: "image", maxCount: 1 }]), createProduct);
router.put("/:id", authorizeRoles("admin"), upload.fields([{ name: "image", maxCount: 1 }]), updateProduct);
router.delete("/:productId", authorizeRoles("admin"), deleteProduct);
router.put("/update-stock/:productId", authorizeRoles("admin"), updateStock);

// 🛒 SHARED ROUTES (admin + user)
router.get("/", getAllProducts);
router.get("/own/:id", getSingleProduct);
router.get("/by-id/:productId",  getProductById);

router.get("/low-stock", getLowStockProducts);
router.get("/out-of-stock", getOutOfStockProducts);
router.get("/categories", getAllCategories);

export default router;
