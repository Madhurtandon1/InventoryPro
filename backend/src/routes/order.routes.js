// src/routes/order.routes.js

import express from "express";
import {
  createOrder,
  updateOrderStatusByOrderNumber,
  getAllOrders,
  getOrderByOrderNumber,
  getOrdersByDateRange,
  getOrdersByCustomer,
  getSalesSummary,
  exportOrderPDF,
  deleteOrder
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";


const router = express.Router();

// All routes below require authentication
router.use(verifyJWT);

// Create a new order
router.post("/",authorizeRoles("admin", "staff"), createOrder);

// Update order status by order number
router.patch("/:orderNumber/status", verifyJWT, updateOrderStatusByOrderNumber);
router.get("/export/pdf", verifyJWT, exportOrderPDF);


// Get all orders with optional filters
router.get("/", authorizeRoles("admin", "staff"), getAllOrders);

// Get order details by order number
router.get("/:orderNumber", authorizeRoles("admin", "staff"), getOrderByOrderNumber);

// Get orders by date range
router.get("/filter/by-date", authorizeRoles("admin", "staff"), getOrdersByDateRange);

// Get orders by customer ID
router.get("/by-customer/:customerId", authorizeRoles("admin", "staff"), getOrdersByCustomer);

// Sales summary report (daily breakdown)
router.get("/sales-summary", authorizeRoles("admin", "staff"), getSalesSummary);

router.delete("/:id", authorizeRoles("admin"), deleteOrder);

export default router;
