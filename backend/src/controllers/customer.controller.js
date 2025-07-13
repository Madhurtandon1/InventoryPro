import { Order } from "../models/order.model.js";
import { Product } from "../models/products.model.js";
import { Customer } from "../models/customer.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { Counter } from "../models/counter.model.js";

// 🔸 Get the correct owner for staff/admin



const getOwnerId = (user) => {
  if (user.role === "admin") return user._id;
  if (user.role === "staff") {
    if (!user.createdBy) throw new ApiError(403, "Staff must belong to a shop");
    return user.createdBy;
  }
  throw new ApiError(403, "Unauthorized role");
};

// ✅ Create a new customer with per-admin sequence
export const createCustomer = asyncHandler(async (req, res) => {
  const { name, phone, email, address } = req.body;

  if (!name?.trim()) {
    throw new ApiError(400, "Customer name is required");
  }

  const ownerId = getOwnerId(req.user);

  // 🧠 Get or create counter for this admin
  const counter = await Counter.findOneAndUpdate(
  { admin: ownerId },
  { $inc: { 'sequences.customer': 1 } },
  { new: true, upsert: true }
);

const customerId = `CUST-${String(counter.sequences.customer).padStart(4, "0")}-${ownerId.toString().slice(-4)}`;


  const newCustomer = await Customer.create({
    name: name.trim(),
    phone,
    email,
    address,
    createdBy: ownerId,
    customerId,
  });

  res.status(201).json(
    new ApiResponse(201, newCustomer, "Customer created successfully")
  );
});


// ✅ Get all customers (with search)
export const getAllCustomers = asyncHandler(async (req, res) => {
  const ownerId = getOwnerId(req.user);
  const query = { createdBy: ownerId };

  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: "i" };
  }

  const customers = await Customer.find(query).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, { customers }));
});

// ✅ Get customer by ID
export const getCustomerById = asyncHandler(async (req, res) => {
  const ownerId = getOwnerId(req.user);
  const { customerId } = req.params;

  const customer = await Customer.findOne({ _id: customerId, createdBy: ownerId });
  if (!customer) throw new ApiError(404, "Customer not found");

  res.status(200).json(new ApiResponse(200, customer));
});

// ✅ Search customer by name
export const getCustomerByName = asyncHandler(async (req, res) => {
  const ownerId = getOwnerId(req.user);
  const { name } = req.query;
  if (!name) throw new ApiError(400, "Name is required");

  const customers = await Customer.find({
    name: { $regex: name, $options: "i" },
    createdBy: ownerId,
  });

  if (!customers.length) throw new ApiError(404, "No matching customers found");

  res.status(200).json(new ApiResponse(200, customers));
});

// ✅ Get all orders by customer
export const getOrdersByCustomer = asyncHandler(async (req, res) => {
  const ownerId = getOwnerId(req.user);
  const { customerId } = req.params;

  const customer = await Customer.findOne({ _id: customerId, createdBy: ownerId });
  if (!customer) throw new ApiError(403, "Unauthorized access to this customer");

  const orders = await Order.find({
    customer: customerId,
    createdBy: ownerId,
  })
    .populate("items.product", "name sku price")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, orders));
});

// ✅ Update customer
export const updateCustomer = asyncHandler(async (req, res) => {
  const ownerId = getOwnerId(req.user);
  const { customerId } = req.params;
  const { name, phone, email, address } = req.body;

  const customer = await Customer.findOne({ _id: customerId, createdBy: ownerId });
  if (!customer) throw new ApiError(404, "Customer not found");

  if (name) customer.name = name;
  if (phone) customer.phone = phone;
  if (email) customer.email = email;
  if (address) customer.address = address;

  await customer.save();
  res.status(200).json(new ApiResponse(200, customer, "Customer updated"));
});

// ✅ Delete customer
export const deleteCustomer = asyncHandler(async (req, res) => {
  const ownerId = getOwnerId(req.user);
  const { customerId } = req.params;

  const customer = await Customer.findOneAndDelete({ _id: customerId, createdBy: ownerId });
  if (!customer) throw new ApiError(404, "Customer not found");

  res.status(200).json(new ApiResponse(200, customer, "Customer deleted"));
});

// ✅ Top customers
export const getTopCustomers = asyncHandler(async (req, res) => {
  const ownerId = getOwnerId(req.user);

  const top = await Order.aggregate([
    { $match: { status: "Completed", createdBy: ownerId } },
    {
      $group: {
        _id: "$customer",
        totalSpent: { $sum: "$totalAmount" },
        totalOrders: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "customers",
        localField: "_id",
        foreignField: "_id",
        as: "customer",
      },
    },
    { $unwind: "$customer" },
    { $sort: { totalSpent: -1 } },
    { $limit: 10 },
    {
      $project: {
        _id: 0,
        customerId: "$customer._id",
        name: "$customer.name",
        totalSpent: 1,
        totalOrders: 1,
      },
    },
  ]);

  res.status(200).json(new ApiResponse(200, top, "Top customers"));
});

// ✅ Recent customers
export const getRecentCustomers = asyncHandler(async (req, res) => {
  const ownerId = getOwnerId(req.user);
  const days = parseInt(req.query.days) || 7;

  const since = new Date();
  since.setDate(since.getDate() - days);

  const customers = await Customer.find({
    createdBy: ownerId,
    createdAt: { $gte: since },
  }).sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, customers, `Customers added in last ${days} days`)
  );
});

// ✅ Customer stats
export const getCustomerStats = asyncHandler(async (req, res) => {
  const ownerId = getOwnerId(req.user);
  const { customerId } = req.params;

  const customer = await Customer.findOne({ _id: customerId, createdBy: ownerId });
  if (!customer) throw new ApiError(403, "Unauthorized access");

  const stats = await Order.aggregate([
    {
      $match: {
        customer: new mongoose.Types.ObjectId(customerId),
        status: "Completed",
        createdBy: ownerId,
      },
    },
    {
      $group: {
        _id: "$customer",
        totalSpent: { $sum: "$totalAmount" },
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json(new ApiResponse(200, stats[0] || {}, "Customer stats"));
});

// ✅ Customers without orders
export const getCustomersWithoutOrders = asyncHandler(async (req, res) => {
  const ownerId = getOwnerId(req.user);

  const customersWithOrders = await Order.distinct("customer", { createdBy: ownerId });

  const customers = await Customer.find({
    _id: { $nin: customersWithOrders },
    createdBy: ownerId,
  });

  res.status(200).json(new ApiResponse(200, customers, "Customers with no orders"));
});

// ✅ Optional backfill customerId utility
export const backfillCustomerIds = asyncHandler(async (req, res) => {
  const ownerId = getOwnerId(req.user);
  const customers = await Customer.find({
    customerId: { $exists: false },
    createdBy: ownerId,
  });

  let updatedCount = 0;
  for (const customer of customers) {
    if (customer.customerCounter) {
      customer.customerId = `CUST-${String(customer.customerCounter).padStart(4, "0")}`;
      await customer.save();
      updatedCount++;
    }
  }

  res.status(200).json(
    new ApiResponse(200, { updatedCount }, `Backfilled ${updatedCount} customers`)
  );
});
