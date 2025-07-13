import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/products.model.js";
import { Customer } from "../models/customer.model.js";

// 📊 Dashboard summary for logged-in shopkeeper
export const getDashboardSummary = asyncHandler(async (req, res) => {
  const user = req.user;

  // Determine the actual owner (admin ID)
  const ownerId = user.role === "staff" ? user.createdBy : user._id;

  // Count based on owner's data
  const [totalProducts, totalCustomers, totalOrders, completedOrders, pendingOrders, cancelledOrders, lowStockCount, revenueAgg] = await Promise.all([
    Product.countDocuments({ createdBy: ownerId }),
    Customer.countDocuments({ createdBy: ownerId }),
    Order.countDocuments({ createdBy: ownerId }),
    Order.countDocuments({ createdBy: ownerId, status: "Completed" }),
    Order.countDocuments({ createdBy: ownerId, status: "Pending" }),
    Order.countDocuments({ createdBy: ownerId, status: "Cancelled" }),
    Product.countDocuments({ createdBy: ownerId, quantity: { $lte: 5 } }),
    Order.aggregate([
      { $match: { createdBy: ownerId, status: "Completed" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
  ]);

  const totalRevenue = revenueAgg[0]?.total || 0;

  res.status(200).json(new ApiResponse(200, {
    totalProducts,
    totalCustomers,
    totalOrders,
    completedOrders,
    pendingOrders,
    cancelledOrders,
    lowStockCount,
    totalRevenue
  }));
});


// 📈 Daily sales trend (last 7 days) for logged-in user
export const getSalesTrend = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const trend = await Order.aggregate([
    { $match: { createdBy: userId, status: "Completed" } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalSales: { $sum: "$totalAmount" },
        orderCount: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    { $limit: 7 }
  ]);

  res.status(200).json(new ApiResponse(200, trend, "Sales trend data"));
});

// 🌟 Top 5 selling products (by quantity) for logged-in user
export const getTopSellingProducts = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const topProducts = await Order.aggregate([
    { $match: { createdBy: userId, status: "Completed" } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        totalSold: { $sum: "$items.quantity" }
      }
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails"
      }
    },
    { $unwind: "$productDetails" },
    { $match: { "productDetails.createdBy": userId } },
    {
      $project: {
        _id: 0,
        productId: "$productDetails._id",
        name: "$productDetails.name",
        sku: "$productDetails.sku",
        totalSold: 1
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 }
  ]);

  res.status(200).json(new ApiResponse(200, topProducts, "Top selling products"));
});
