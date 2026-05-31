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

// export const createOrder = asyncHandler(async (req, res) => {
//   const { customer, items, paymentMethod, status = "Completed" } = req.body;

//   if (!customer || !items || items.length === 0 || !paymentMethod) {
//     throw new ApiError(400, "All fields (customer, items, paymentMethod) are required");
//   }

// const ownerId = req.user.role === "staff" ? req.user.createdBy : req.user._id;
//   const orderItems = [];

//   for (const item of items) {
//     const product = await Product.findOne({ _id: item.product, createdBy: ownerId });
//     if (!product) throw new ApiError(404, `Product not found: ${item.product}`);

//     if (status === "Completed" && product.quantity < item.quantity) {
//       throw new ApiError(400, `Insufficient stock for product: ${product.name}`);
//     }

//     orderItems.push({
//       product: product._id,
//       quantity: item.quantity,
//       priceAtPurchase: product.price,
//     });

//     if (status === "Completed") {
//       product.quantity -= item.quantity;
//       await product.save();
//     }
//   }

//   // ✅ Increment order sequence for this admin
// const counter = await Counter.findOneAndUpdate(
//   { admin: ownerId },
//   { $inc: { 'sequences.order': 1 } },
//   { new: true, upsert: true }
// );

// const orderNumber = `INV-${String(counter.sequences.order).padStart(4, "0")}-${ownerId.toString().slice(-4)}`;


//   const totalAmount = orderItems.reduce(
//     (sum, item) => sum + item.quantity * item.priceAtPurchase,
//     0
//   );

//   const newOrder = await Order.create({
//     customer,
//     items: orderItems,
//     paymentMethod,
//     status,
//     orderNumber,
//     totalAmount,
//     createdBy: ownerId,
//   });

//   const lowStockAlert = await Product.find({
//     createdBy: ownerId,
//     quantity: { $lte: 5 },
//   }).select("name sku quantity");

//   res.status(201).json(
//     new ApiResponse(201, {
//       order: newOrder,
//       lowStockAlert,
//     }, "Order created successfully.")
//   );
// });

export const createOrder = asyncHandler(async (req, res) => {

  const session = await mongoose.startSession();

  session.startTransaction();

  try {

    const {
      customer,
      items,
      paymentMethod,
      status = "Completed",
    } = req.body;

    // Validation
    if (
      !customer ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !paymentMethod
    ) {
      throw new ApiError(
        400,
        "Customer, items, and paymentMethod are required"
      );
    }

    // Multi-tenant owner
    const ownerId =
      req.user.role === "staff"
        ? req.user.createdBy
        : req.user._id;

    // Get all product IDs
    const productIds = items.map(
      item => item.product
    );

    // Fetch all products in ONE query
    const products = await Product.find({
      _id: { $in: productIds },
      createdBy: ownerId,
    }).session(session);

    // Convert array → map for fast lookup
    const productMap = new Map();

    products.forEach(product => {
      productMap.set(
        product._id.toString(),
        product
      );
    });

    const orderItems = [];

    // Validate items + stock
    for (const item of items) {

      const product =
        productMap.get(
          item.product.toString()
        );

      // Product not found
      if (!product) {
        throw new ApiError(
          404,
          `Product not found: ${item.product}`
        );
      }

      // Quantity validation
      if (
        !item.quantity ||
        item.quantity <= 0
      ) {
        throw new ApiError(
          400,
          `Invalid quantity for ${product.name}`
        );
      }

      // Stock validation
      if (
        status === "Completed" &&
        product.quantity < item.quantity
      ) {
        throw new ApiError(
          400,
          `Insufficient stock for ${product.name}`
        );
      }

      // Prepare order item
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      });

      // Deduct stock
      if (status === "Completed") {

        product.quantity -= item.quantity;

        await product.save({
          session,
        });
      }
    }

    // Generate order sequence
    const counter =
      await Counter.findOneAndUpdate(
        {
          admin: ownerId,
        },
        {
          $inc: {
            "sequences.order": 1,
          },
        },
        {
          new: true,
          upsert: true,
          session,
        }
      );

    // Order number
    const orderNumber =
      `INV-${String(
        counter.sequences.order
      ).padStart(4, "0")}-${ownerId
        .toString()
        .slice(-4)}`;

    // Calculate total
    const totalAmount =
      orderItems.reduce(
        (sum, item) =>
          sum +
          item.quantity *
            item.priceAtPurchase,
        0
      );

    // Create order
    const newOrder =
      await Order.create(
        [
          {
            customer,
            items: orderItems,
            paymentMethod,
            status,
            orderNumber,
            totalAmount,
            createdBy: ownerId,
          },
        ],
        { session }
      );

    // Commit transaction
    await session.commitTransaction();

    // Low stock alert
    const lowStockAlert =
      await Product.find({
        createdBy: ownerId,
        quantity: { $lte: 5 },
      })
        .select(
          "name sku quantity"
        )
        .sort({ quantity: 1 })
        .limit(10)
        .lean();

    // Response
    return res.status(201).json(
      new ApiResponse(
        201,
        {
          order: newOrder[0],
          lowStockAlert,
        },
        "Order created successfully"
      )
    );

  } catch (error) {

    // Rollback transaction
    await session.abortTransaction();

    throw error;

  } finally {

    // End session
    session.endSession();
  }
});



// Update status by order number
// export const updateOrderStatusByOrderNumber = asyncHandler(async (req, res) => {
//   const { orderNumber } = req.params;
//   const { status } = req.body;

//   if (!["Pending", "Completed", "Cancelled"].includes(status)) {
//     throw new ApiError(400, "Invalid status value");
//   }

//   const ownerId = req.user.role === "staff" ? req.user.createdBy : req.user._id;

//   const order = await Order.findOne({ orderNumber, createdBy: ownerId }).populate("items.product");
//   if (!order) throw new ApiError(404, "Order not found");

//   if (status === "Completed" && order.status !== "Completed") {
//     for (const item of order.items) {
//       const product = await Product.findOne({ _id: item.product._id, createdBy: ownerId });
//       if (!product) continue;

//       if (product.quantity < item.quantity) {
//         throw new ApiError(400, `Insufficient stock for product: ${product.name}`);
//       }

//       product.quantity -= item.quantity;
//       await product.save();
//     }
//   }

//   if (order.status === "Completed" && status === "Cancelled") {
//     for (const item of order.items) {
//       const product = await Product.findOne({ _id: item.product._id, createdBy: ownerId });
//       if (!product) continue;

//       product.quantity += item.quantity;
//       await product.save();
//     }
//   }

//   order.status = status;
//   await order.save();

//   res.status(200).json(new ApiResponse(200, order, "Order status updated"));
// });

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
// export const getAllOrders = asyncHandler(async (req, res) => {
//   const { status, page = 1, limit = 10 } = req.query;
//   const ownerId = req.user.role === "staff" ? req.user.createdBy : req.user._id;

//   const filter = { createdBy: ownerId };
//   if (status) filter.status = status;

//   const skip = (Number(page) - 1) * Number(limit);

//   const orders = await Order.find(filter)
//     .populate("customer", "name email")
//     .populate("items.product", "name price")
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(Number(limit));

//   const total = await Order.countDocuments(filter);

//   res.status(200).json(
//     new ApiResponse(200, {
//       orders,
//       pagination: {
//         total,
//         page: Number(page),
//         limit: Number(limit),
//         totalPages: Math.ceil(total / limit),
//       },
//     }, "Orders fetched successfully")
//   );
// });
export const getAllOrders = asyncHandler(async (req, res) => {

    // Query params
    const status = req.query.status;

    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Number(req.query.limit) || 10,
      50
    );

    const skip = (page - 1) * limit;

    // Owner
    const ownerId =
      req.user.role === "staff"
        ? req.user.createdBy
        : req.user._id;

    // Filter
    const filter = {
      createdBy: ownerId,
    };

    if (status) {
      filter.status = status;
    }

    // Fetch orders
    const orders = await Order.find(filter)
      .select(
        "orderNumber customer items totalAmount paymentMethod status createdAt"
      )
      .populate({
        path: "customer",
        select: "name email",
        options: { lean: true },
      })
      .populate({
        path: "items.product",
        select: "name price",
        options: { lean: true },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Total count
    const total =
      await Order.countDocuments(filter);

    // Response
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          orders,
          pagination: {
            total,
            currentPage: page,
            totalPages: Math.ceil(
              total / limit
            ),
            limit,
          },
        },
        "Orders fetched successfully"
      )
    );
  });

// Get single order by order number
// export const getOrderByOrderNumber = asyncHandler(async (req, res) => {
//   const { orderNumber } = req.params;
//   const ownerId = req.user.role === "staff" ? req.user.createdBy : req.user._id;

//   const order = await Order.findOne({ orderNumber, createdBy: ownerId })
//     .populate("customer", "name email phone")
//     .populate("items.product", "name sku price image");

//   if (!order) throw new ApiError(404, "Order not found");

//   res.status(200).json(new ApiResponse(200, order, "Order fetched successfully"));
// });
export const getOrderByOrderNumber = asyncHandler(async (req, res) => {

    const { orderNumber } = req.params;

    // Owner
    const ownerId =
      req.user.role === "staff"
        ? req.user.createdBy
        : req.user._id;

    // Fetch order
    const order =
      await Order.findOne({
        orderNumber,
        createdBy: ownerId,
      })
        .select(
          "orderNumber customer items totalAmount paymentMethod status createdAt"
        )
        .populate({
          path: "customer",
          select: "name email phone",
          options: { lean: true },
        })
        .populate({
          path: "items.product",
          select: "name sku price",
          options: { lean: true },
        })
        .lean();

    // Order not found
    if (!order) {
      throw new ApiError(
        404,
        "Order not found"
      );
    }

    // Response
    return res.status(200).json(
      new ApiResponse(
        200,
        order,
        "Order fetched successfully"
      )
    );
  });

// Orders by date range
// export const getOrdersByDateRange = asyncHandler(async (req, res) => {
//   const { startDate, endDate, status } = req.query;
//   const ownerId = req.user.role === "staff" ? req.user.createdBy : req.user._id;

//   if (!startDate || !endDate) throw new ApiError(400, "startDate and endDate are required");

//   const start = new Date(startDate);
//   const end = new Date(endDate);
//   if (isNaN(start) || isNaN(end)) throw new ApiError(400, "Invalid date format");

//   const filter = {
//     createdAt: { $gte: start, $lte: end },
//     createdBy: ownerId,
//   };
//   if (status) filter.status = status;

//   const orders = await Order.find(filter).sort({ createdAt: -1 });

//   res.status(200).json(new ApiResponse(200, orders, "Orders filtered by date"));
// });

export const getOrdersByDateRange = asyncHandler(async (req, res) => {

    const {
      startDate,
      endDate,
      status,
    } = req.query;

    // Pagination
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Number(req.query.limit) || 10,
      50
    );

    const skip = (page - 1) * limit;

    // Owner
    const ownerId =
      req.user.role === "staff"
        ? req.user.createdBy
        : req.user._id;

    // Validation
    if (!startDate || !endDate) {
      throw new ApiError(
        400,
        "startDate and endDate are required"
      );
    }

    // Parse dates
    const start = new Date(startDate);

    const end = new Date(endDate);

    // Invalid date check
    if (
      isNaN(start.getTime()) ||
      isNaN(end.getTime())
    ) {
      throw new ApiError(
        400,
        "Invalid date format"
      );
    }

    // Filter object
    const filter = {
      createdBy: ownerId,
      createdAt: {
        $gte: start,
        $lte: end,
      },
    };

    // Optional status filter
    if (status) {
      filter.status = status;
    }

    // Fetch orders
    const orders = await Order.find(filter)
      .select(
        "orderNumber customer totalAmount paymentMethod status createdAt"
      )
      .populate({
        path: "customer",
        select: "name email",
        options: { lean: true },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Total count
    const total =
      await Order.countDocuments(filter);

    // Response
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          orders,
          pagination: {
            total,
            currentPage: page,
            totalPages: Math.ceil(
              total / limit
            ),
            limit,
          },
        },
        "Orders filtered by date"
      )
    );
  });

// Orders by customer
// export const getOrdersByCustomer = asyncHandler(async (req, res) => {
//   const { customerId } = req.params;
//   const ownerId = req.user.role === "staff" ? req.user.createdBy : req.user._id;

//   const orders = await Order.find({
//     customer: customerId,
//     createdBy: ownerId,
//   }).populate("items.product", "name price sku");

//   res.status(200).json(new ApiResponse(200, orders, "Orders by customer"));
// });
export const getOrdersByCustomer = asyncHandler(async (req, res) => {

    const { customerId } = req.params;

    // Pagination
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Number(req.query.limit) || 10,
      50
    );

    const skip = (page - 1) * limit;

    // Owner
    const ownerId =
      req.user.role === "staff"
        ? req.user.createdBy
        : req.user._id;

    // Filter object
    const filter = {
      customer: customerId,
      createdBy: ownerId,
    };

    // Fetch orders
    const orders = await Order.find(filter)
      .select(
        "orderNumber items totalAmount paymentMethod status createdAt"
      )
      .populate({
        path: "items.product",
        select: "name price sku",
        options: { lean: true },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Total count
    const total =
      await Order.countDocuments(filter);

    // Response
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          orders,
          pagination: {
            total,
            currentPage: page,
            totalPages: Math.ceil(
              total / limit
            ),
            limit,
          },
        },
        "Orders by customer fetched successfully"
      )
    );
  });

// Sales summary (daily)
// export const getSalesSummary = asyncHandler(async (req, res) => {
//   const ownerId = req.user.role === "staff" ? req.user.createdBy : req.user._id;

//   const sales = await Order.aggregate([
//     {
//       $match: {
//         createdBy: ownerId,
//         status: "Completed",
//       },
//     },
//     {
//       $group: {
//         _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//         totalSales: { $sum: "$totalAmount" },
//         count: { $sum: 1 },
//       },
//     },
//     { $sort: { _id: -1 } },
//   ]);

//   res.status(200).json(new ApiResponse(200, sales, "Daily sales summary"));
// });
export const getSalesSummary = asyncHandler(async (req, res) => {

    // Pagination
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Number(req.query.limit) || 10,
      50
    );

    const skip = (page - 1) * limit;

    // Optional date filters
    const {
      startDate,
      endDate,
    } = req.query;

    // Owner
    const ownerId =
      req.user.role === "staff"
        ? req.user.createdBy
        : req.user._id;

    // Match stage
    const matchStage = {
      createdBy: ownerId,
      status: "Completed",
    };

    // Optional date filtering
    if (startDate && endDate) {

      const start =
        new Date(startDate);

      const end =
        new Date(endDate);

      if (
        isNaN(start.getTime()) ||
        isNaN(end.getTime())
      ) {
        throw new ApiError(
          400,
          "Invalid date format"
        );
      }

      matchStage.createdAt = {
        $gte: start,
        $lte: end,
      };
    }

    // Aggregation pipeline
    const sales = await Order.aggregate([

      // Filter orders
      {
        $match: matchStage,
      },

      // Group by date
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          totalSales: {
            $sum: "$totalAmount",
          },
          totalOrders: {
            $sum: 1,
          },
        },
      },

      // Sort latest first
      {
        $sort: {
          _id: -1,
        },
      },

      // Pagination
      {
        $skip: skip,
      },

      {
        $limit: limit,
      },

    ]);

    // Overall totals
    const overall =
      await Order.aggregate([

        {
          $match: matchStage,
        },

        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$totalAmount",
            },
            totalOrders: {
              $sum: 1,
            },
          },
        },

      ]);

    // Response
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          sales,
          summary:
            overall[0] || {
              totalRevenue: 0,
              totalOrders: 0,
            },
          pagination: {
            currentPage: page,
            limit,
          },
        },
        "Daily sales summary fetched successfully"
      )
    );
  });

// Delete order
// export const deleteOrder = asyncHandler(async (req, res) => {
//   const ownerId = req.user.role === "staff" ? req.user.createdBy : req.user._id;

//   const order = await Order.findOneAndDelete({
//     _id: req.params.id,
//     createdBy: ownerId,
//   });

//   if (!order) throw new ApiError(404, "Order not found");

//   res.status(200).json(new ApiResponse(200, {}, "Order deleted successfully"));
// });
export const deleteOrder =  asyncHandler(async (req, res) => {

    // Owner
    const ownerId =
      req.user.role === "staff"
        ? req.user.createdBy
        : req.user._id;

    // Delete order
    const order =
      await Order.findOneAndDelete({
        _id: req.params.id,
        createdBy: ownerId,
      });

    // Order not found
    if (!order) {
      throw new ApiError(
        404,
        "Order not found"
      );
    }

    // Response
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          orderId: order._id,
          orderNumber:
            order.orderNumber,
        },
        "Order deleted successfully"
      )
    );
  });


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const exportOrderPDF = asyncHandler(async (req, res) => {
//   // Determine Owner
//   const ownerId = req.user.role === "staff" ? req.user.createdBy : req.user._id;

//   // Fetch orders matching shop parameters
//   const orders = await Order.find({ createdBy: ownerId })
//     .select("orderNumber customer items totalAmount paymentMethod status createdAt")
//     .populate({
//       path: "customer",
//       select: "name email phone",
//       options: { lean: true },
//     })
//     .populate({
//       path: "items.product",
//       select: "name sku price",
//       options: { lean: true },
//     })
//     .sort({ createdAt: -1 })
//     .lean();

//   const fileName = `orders-${Date.now()}.pdf`;
//   const publicDir = path.join(__dirname, "../../public");

//   if (!fs.existsSync(publicDir)) {
//     fs.mkdirSync(publicDir, { recursive: true });
//   }

//   const outputPath = path.join(publicDir, fileName);
//   console.log("Generating fresh statement PDF node at:", outputPath);

//   // Generate the actual PDF layout file
//   try {
//     await generateOrderPDF(orders, outputPath);
//   } catch (err) {
//     console.error("PDF engine structural generation failed:", err);
//     throw new ApiError(500, "PDF generation step fault on engine stream");
//   }

//   // ⚡ FIX 2: Send file cleanly via response download stream pipelines
//   res.download(outputPath, fileName, (err) => {
//     if (err) {
//       console.error("Download pipeline broke down mid-stream:", err);
//     }

//     // ⚡ FIX 3: Safe synchronous deletion happens ONLY after download is completely finished or dropped
//     try {
//       if (fs.existsSync(outputPath)) {
//         fs.unlinkSync(outputPath);
//         console.log("Temporary storage file cleared cleanly from disk cache.");
//       }
//     } catch (unlinkErr) {
//       console.error("File cleanup failed:", unlinkErr);
//     }
//   });
// });const __filename = fileURLToPath(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to create a small delay for background file compiling
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const exportOrderPDF = asyncHandler(async (req, res) => {
  const ownerId = req.user.role === "staff" ? req.user.createdBy : req.user._id;

  // Fetch data rows securely
  const rawOrders = await Order.find({ createdBy: ownerId })
    .select("orderNumber customer items totalAmount paymentMethod status createdAt")
    .populate({
      path: "customer",
      select: "name email phone",
      options: { lean: true },
    })
    .populate({
      path: "items.product",
      select: "name sku price",
      options: { lean: true },
    })
    .sort({ createdAt: -1 })
    .lean();

  // Clean data properties to prevent crash mutations
  const orders = rawOrders.map(order => ({
    ...order,
    orderNumber: order.orderNumber || "UNKNOWN-BILL",
    paymentMethod: order.paymentMethod ? String(order.paymentMethod).replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "") : "Paid",
    customer: {
      name: order.customer?.name || "Walk-In Customer",
      email: order.customer?.email || "N/A",
      phone: order.customer?.phone || "N/A"
    },
    items: (order.items || []).map(item => ({
      quantity: item.quantity || 1,
      product: {
        name: item.product?.name || "Deleted Product Item",
        sku: item.product?.sku || "N/A",
        price: item.product?.price || 0
      }
    }))
  }));

  const fileName = `orders-${Date.now()}.pdf`;
  const publicDir = path.join(__dirname, "../../public");
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outputPath = path.join(publicDir, fileName);
  console.log("Generating fresh statement PDF node at safe route:", outputPath);

  try {
    // 1. Fire file creation process
    await generateOrderPDF(orders, outputPath);
    
    // ⚡ FIX: Wait exactly 1.5 seconds to let the file stream finish writing on Render's disk layer
    console.log("Waiting for file stream serialization to complete...");
    await delay(1500);

    // 2. Run check now that file has compiled completely
    if (!fs.existsSync(outputPath)) {
      throw new Error("PDF generation took too long or disk stream dropped out.");
    }

    // 3. Send file out cleanly via download pipe
    res.sendFile(outputPath, { headers: { "Content-Disposition": `attachment; filename="${fileName}"` } }, (err) => {
      if (err) console.error("Pipeline streaming error:", err);
      
      // Clear storage footprint
      fs.unlink(outputPath, (e) => {
        if (e) console.error("Cleanup warning:", e);
        else console.log("Temporary document cleared cleanly from cache.");
      });
    });

  } catch (err) {
    console.error("❌ CRITICAL PDF CORE GENERATION FAILURE DETECTED:");
    console.error("Error Message ->", err.message);

    if (fs.existsSync(outputPath)) {
      try { fs.unlinkSync(outputPath); } catch (e) {}
    }

    throw new ApiError(500, `Failed to compile statement PDF documentation: ${err.message}`);
  }
});