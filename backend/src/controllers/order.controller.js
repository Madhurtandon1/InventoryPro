import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/products.model.js";
import { Order } from "../models/order.model.js";
import { Counter } from "../models/counter.model.js";

import { generateOrderPDF } from "../utils/generateOrderPDF.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";



// Create a new order

export const createOrder = asyncHandler(async (req, res) => {
  const { customer, items, paymentMethod, status = "Completed" } = req.body;

  if (!customer || !items || items.length === 0 || !paymentMethod) {
    throw new ApiError(400, "All fields (customer, items, paymentMethod) are required");
  }

const ownerId = req.user.role === "staff" ? req.user.createdBy : req.user._id;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findOne({ _id: item.product, createdBy: ownerId });
    if (!product) throw new ApiError(404, `Product not found: ${item.product}`);

    if (status === "Completed" && product.quantity < item.quantity) {
      throw new ApiError(400, `Insufficient stock for product: ${product.name}`);
    }

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      priceAtPurchase: product.price,
    });

    if (status === "Completed") {
      product.quantity -= item.quantity;
      await product.save();
    }
  }

  // ✅ Increment order sequence for this admin
const counter = await Counter.findOneAndUpdate(
  { admin: ownerId },
  { $inc: { 'sequences.order': 1 } },
  { new: true, upsert: true }
);

const orderNumber = `INV-${String(counter.sequences.order).padStart(4, "0")}-${ownerId.toString().slice(-4)}`;


  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.quantity * item.priceAtPurchase,
    0
  );

  const newOrder = await Order.create({
    customer,
    items: orderItems,
    paymentMethod,
    status,
    orderNumber,
    totalAmount,
    createdBy: ownerId,
  });

  const lowStockAlert = await Product.find({
    createdBy: ownerId,
    quantity: { $lte: 5 },
  }).select("name sku quantity");

  res.status(201).json(
    new ApiResponse(201, {
      order: newOrder,
      lowStockAlert,
    }, "Order created successfully.")
  );
});



// Update status by order number
export const updateOrderStatusByOrderNumber = asyncHandler(async (req, res) => {
  const { orderNumber } = req.params;
  const { status } = req.body;

  if (!["Pending", "Completed", "Cancelled"].includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const ownerId = req.user.role === "staff" ? req.user.createdBy : req.user._id;

  const order = await Order.findOne({ orderNumber, createdBy: ownerId }).populate("items.product");
  if (!order) throw new ApiError(404, "Order not found");

  if (status === "Completed" && order.status !== "Completed") {
    for (const item of order.items) {
      const product = await Product.findOne({ _id: item.product._id, createdBy: ownerId });
      if (!product) continue;

      if (product.quantity < item.quantity) {
        throw new ApiError(400, `Insufficient stock for product: ${product.name}`);
      }

      product.quantity -= item.quantity;
      await product.save();
    }
  }

  if (order.status === "Completed" && status === "Cancelled") {
    for (const item of order.items) {
      const product = await Product.findOne({ _id: item.product._id, createdBy: ownerId });
      if (!product) continue;

      product.quantity += item.quantity;
      await product.save();
    }
  }

  order.status = status;
  await order.save();

  res.status(200).json(new ApiResponse(200, order, "Order status updated"));
});

// Get all orders for the shop (admin/staff)
export const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const ownerId = req.user.role === "staff" ? req.user.createdBy : req.user._id;

  const filter = { createdBy: ownerId };
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const orders = await Order.find(filter)
    .populate("customer", "name email")
    .populate("items.product", "name price")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Order.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(200, {
      orders,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    }, "Orders fetched successfully")
  );
});

// Get single order by order number
export const getOrderByOrderNumber = asyncHandler(async (req, res) => {
  const { orderNumber } = req.params;
  const ownerId = req.user.role === "staff" ? req.user.createdBy : req.user._id;

  const order = await Order.findOne({ orderNumber, createdBy: ownerId })
    .populate("customer", "name email phone")
    .populate("items.product", "name sku price image");

  if (!order) throw new ApiError(404, "Order not found");

  res.status(200).json(new ApiResponse(200, order, "Order fetched successfully"));
});

// Orders by date range
export const getOrdersByDateRange = asyncHandler(async (req, res) => {
  const { startDate, endDate, status } = req.query;
  const ownerId = req.user.role === "staff" ? req.user.createdBy : req.user._id;

  if (!startDate || !endDate) throw new ApiError(400, "startDate and endDate are required");

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start) || isNaN(end)) throw new ApiError(400, "Invalid date format");

  const filter = {
    createdAt: { $gte: start, $lte: end },
    createdBy: ownerId,
  };
  if (status) filter.status = status;

  const orders = await Order.find(filter).sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, orders, "Orders filtered by date"));
});

// Orders by customer
export const getOrdersByCustomer = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const ownerId = req.user.role === "staff" ? req.user.createdBy : req.user._id;

  const orders = await Order.find({
    customer: customerId,
    createdBy: ownerId,
  }).populate("items.product", "name price sku");

  res.status(200).json(new ApiResponse(200, orders, "Orders by customer"));
});

// Sales summary (daily)
export const getSalesSummary = asyncHandler(async (req, res) => {
  const ownerId = req.user.role === "staff" ? req.user.createdBy : req.user._id;

  const sales = await Order.aggregate([
    {
      $match: {
        createdBy: ownerId,
        status: "Completed",
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalSales: { $sum: "$totalAmount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: -1 } },
  ]);

  res.status(200).json(new ApiResponse(200, sales, "Daily sales summary"));
});

// Delete order
export const deleteOrder = asyncHandler(async (req, res) => {
  const ownerId = req.user.role === "staff" ? req.user.createdBy : req.user._id;

  const order = await Order.findOneAndDelete({
    _id: req.params.id,
    createdBy: ownerId,
  });

  if (!order) throw new ApiError(404, "Order not found");

  res.status(200).json(new ApiResponse(200, {}, "Order deleted successfully"));
});



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const exportOrderPDF = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const role = req.user.role;

  let ownerId = userId;

  if (role === "staff") {
    const staff = await User.findById(userId);
    ownerId = staff.createdBy;
  }

  const orders = await Order.find({ createdBy: ownerId })
    .populate("customer")
    .populate("items.product") 
    .sort({ createdAt: -1 });

  const outputPath = path.join(__dirname, "../../public/orders.pdf");

  generateOrderPDF(orders, outputPath);

  // Wait a moment for the file to finish writing
  setTimeout(() => {
    res.download(outputPath, "orders.pdf", (err) => {
      if (err) console.error("Download failed:", err);
      fs.unlinkSync(outputPath); // delete after download
    });
  }, 1000);
});
