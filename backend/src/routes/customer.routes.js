import express from "express";
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  getCustomerByName,
  getOrdersByCustomer,
  updateCustomer,
  deleteCustomer,
  getTopCustomers,
  getRecentCustomers,
  getCustomerStats,
  getCustomersWithoutOrders
} from "../controllers/customer.controller.js";

import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";
import { backfillCustomerIds } from "../controllers/customer.controller.js";




const router = express.Router();

// ✅ All routes protected: Only shop owners (admin) can manage customers
router.use(verifyJWT);

// ------------------------
// 📊 Analytics Routes (must come first to avoid conflict)
// ------------------------

// 🥇 Top customers by total sales
router.get("/analytics/top", authorizeRoles("admin", "staff"),  getTopCustomers);

router.get("/backfill-customer-ids", backfillCustomerIds);

// 📆 Recently added customers (?days=7)
router.get("/analytics/recent", authorizeRoles("admin", "staff"), getRecentCustomers);

// 📊 Stats for specific customer
router.get("/analytics/:customerId/stats", authorizeRoles("admin", "staff"), getCustomerStats);

// ❌ Customers with no orders
router.get("/analytics/no-orders", authorizeRoles("admin", "staff"), getCustomersWithoutOrders);

// ------------------------
// 📦 Core Customer CRUD
// ------------------------

// ➕ Create new customer
router.post("/",authorizeRoles("admin"), createCustomer);

// 🔍 Search customer by name (?name=abc)
router.get("/search", authorizeRoles("admin", "staff"), getCustomerByName);

// 📄 Get all customers (pagination + search)
router.get("/", authorizeRoles("admin", "staff"), getAllCustomers);

// 🧾 Get all orders by a customer
router.get("/:customerId/orders", authorizeRoles("admin", "staff"), getOrdersByCustomer);

// 👤 Get customer by ID
router.get("/:customerId",  getCustomerById);

// ✏️ Update customer
router.put("/:customerId", authorizeRoles("admin"),updateCustomer);

// 🗑️ Delete customer
router.delete("/:customerId",authorizeRoles("admin"), deleteCustomer);

export default router;
