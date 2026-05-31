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

export const getAllCustomers = asyncHandler(async (req, res) => {

  const ownerId = getOwnerId(req.user);

  // Pagination
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 10, 50);

  // Base query
  const query = {
    createdBy: ownerId,
  };

  // Search
  if (req.query.search?.trim()) {
    query.name = {
      $regex: `^${req.query.search.trim()}`,
      $options: "i",
    };
  }

  // Fetch customers
  const customers = await Customer.find(query)
    .select("customerId name phone email createdAt")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  // Total count for frontend pagination
  const totalCustomers = await Customer.countDocuments(query);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        customers,
        pagination: {
          totalCustomers,
          currentPage: page,
          totalPages: Math.ceil(totalCustomers / limit),
          limit,
        },
      },
      "Customers fetched successfully"
    )
  );
});


// ✅ Get all customers (with search)
// export const getAllCustomers = asyncHandler(async (req, res) => {
//   const ownerId = getOwnerId(req.user);
//   const query = { createdBy: ownerId };

//   if (req.query.search) {
//     query.name = { $regex: req.query.search, $options: "i" };
//   }

//   const customers = await Customer.find(query).sort({ createdAt: -1 });
//   res.status(200).json(new ApiResponse(200, { customers }));
// });

// // ✅ Get customer by ID
// export const getCustomerById = asyncHandler(async (req, res) => {
//   const ownerId = getOwnerId(req.user);
//   const { customerId } = req.params;

//   const customer = await Customer.findOne({ _id: customerId, createdBy: ownerId });
//   if (!customer) throw new ApiError(404, "Customer not found");

//   res.status(200).json(new ApiResponse(200, customer));
// });
export const getCustomerById = asyncHandler(async (req, res) => {

  const ownerId = getOwnerId(req.user);

  const { customerId } = req.params;

  // Fetch customer
  const customer = await Customer.findOne({
    _id: customerId,
    createdBy: ownerId,
  })
    .select(
      "customerId name phone email address createdAt"
    )
    .lean();

  // Customer not found
  if (!customer) {
    throw new ApiError(
      404,
      "Customer not found"
    );
  }

  // Response
  return res.status(200).json(
    new ApiResponse(
      200,
      customer,
      "Customer fetched successfully"
    )
  );
});
// ✅ Search customer by name
// export const getCustomerByName = asyncHandler(async (req, res) => {
//   const ownerId = getOwnerId(req.user);

//     // Pagination
//   const page = Math.max(Number(req.query.page) || 1, 1);
//   const limit = Math.min(Number(req.query.limit) || 10, 50);
  
//   const { name } = req.query;
//   if (!name) throw new ApiError(400, "Name is required");

//   const customers = await Customer.find({
//     name: { $regex: name, $options: "i" },
//     createdBy: ownerId,
//   })
//     .skip((page - 1) * limit)
//     .limit(limit)
//     .lean();

//   if (!customers.length) throw new ApiError(404, "No matching customers found");
//   // Total count for frontend pagination
//   const totalCustomers = await Customer.countDocuments(query);
//   res.status(200).json(new ApiResponse(200, { customers, 
//     pagination: { totalCustomers,
//       currentPage: page,
//       totalPages: Math.ceil(totalCustomers / limit),
//       limit } }));
// });

export const getCustomerByName = asyncHandler(async (req, res) => {

  const ownerId = getOwnerId(req.user);

  // Pagination
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 10, 50);

  const { name } = req.query;

  // Validation
  if (!name?.trim()) {
    throw new ApiError(400, "Name is required");
  }

  // Query object
  const query = {
    createdBy: ownerId,
    name: {
      $regex: `^${name.trim()}`,
      $options: "i",
    },
  };

  // Fetch customers
  const customers = await Customer.find(query)
    .select("customerId name phone email createdAt")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  // Count documents
  const totalCustomers = await Customer.countDocuments(query);

  if (!customers.length) {
    throw new ApiError(404, "No matching customers found");
  }

  // Response
  res.status(200).json(
    new ApiResponse(
      200,
      {
        customers,
        pagination: {
          totalCustomers,
          currentPage: page,
          totalPages: Math.ceil(totalCustomers / limit),
          limit,
        },
      },
      "Customers fetched successfully"
    )
  );
});

// ✅ Get all orders by customer
// export const getOrdersByCustomer = asyncHandler(async (req, res) => {
//   const ownerId = getOwnerId(req.user);
//   const { customerId } = req.params;

//   const customer = await Customer.findOne({ _id: customerId, createdBy: ownerId });
//   if (!customer) throw new ApiError(403, "Unauthorized access to this customer");

//   const orders = await Order.find({
//     customer: customerId,
//     createdBy: ownerId,
//   })
//     .populate("items.product", "name sku price")
//     .sort({ createdAt: -1 });

//   res.status(200).json(new ApiResponse(200, orders));
// });
export const getOrdersByCustomer = asyncHandler(async (req, res) => {

  const ownerId = getOwnerId(req.user);
  const { customerId } = req.params;

  // Pagination
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 10, 50);

  // Verify customer ownership
  const customerExists = await Customer.exists({
    _id: customerId,
    createdBy: ownerId,
  });

  if (!customerExists) {
    throw new ApiError(403, "Unauthorized access to this customer");
  }

  // Query object
  const query = {
    customer: customerId,
    createdBy: ownerId,
  };

  // Fetch orders
  const orders = await Order.find(query)
    .select("orderNumber totalAmount paymentMethod status items createdAt")
    .populate({
      path: "items.product",
      select: "name sku price",
    })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  // Total count
  const totalOrders = await Order.countDocuments(query);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        orders,
        pagination: {
          totalOrders,
          currentPage: page,
          totalPages: Math.ceil(totalOrders / limit),
          limit,
        },
      },
      "Orders fetched successfully"
    )
  );
});

// ✅ Update customer
// export const updateCustomer = asyncHandler(async (req, res) => {
//   const ownerId = getOwnerId(req.user);
//   const { customerId } = req.params;
//   const { name, phone, email, address } = req.body;


//   // Verify customer ownership
//   const customerExists = await Customer.exists({
//     _id: customerId,
//     createdBy: ownerId,
//   });  
//    if (!customerExists) {
//     throw new ApiError(403, "Unauthorized access to this customer");
//   }

//   if (name) customerExists.name = name;
//   if (phone) customerExists.phone = phone;
//   if (email) customerExists.email = email;
//   if (address) customerExists.address = address;

//   await customerExists.save();
//   res.status(200).json(new ApiResponse(200, customerExists, "Customer updated"));
// });
// export const updateCustomer = asyncHandler(async (req, res) => {

//   const ownerId = getOwnerId(req.user);
//   const { customerId } = req.params;

//   const { name, phone, email, address } = req.body;

//   // Build update object dynamically
//   const updateFields = {};

//   if (name?.trim()) updateFields.name = name.trim();
//   if (phone) updateFields.phone = phone;
//   if (email) updateFields.email = email;
//   if (address) updateFields.address = address;

//   // Update customer
//   const updatedCustomer = await Customer.findOneAndUpdate(
//     {
//       _id: customerId,
//       createdBy: ownerId,
//     },
//     {
//       $set: updateFields,
//     },
//     {
//       new: true,
//       runValidators: true,
//     }
//   ).lean();

//   if (!updatedCustomer) {
//     throw new ApiError(404, "Customer not found");
//   }

//   res.status(200).json(
//     new ApiResponse(
//       200,
//       updatedCustomer,
//       "Customer updated successfully"
//     )
//   );
// });
export const updateCustomer = asyncHandler(async (req, res) => {
  const ownerId = getOwnerId(req.user);
  const { customerId } = req.params;

  // Build the update payload dynamically
  const updateFields = {};

  // 👥 Check if Name was sent
  if (req.body.name !== undefined) {
    if (!req.body.name.trim()) {
      throw new ApiError(400, "Customer name cannot be empty spaces");
    }
    updateFields.name = req.body.name.trim();
  }

  // 📞 Check if Phone was sent (allows adding new number, updating, or clearing)
  if (req.body.phone !== undefined) {
    updateFields.phone = req.body.phone.trim();
  }

  // 📧 Check if Email was sent
  if (req.body.email !== undefined) {
    updateFields.email = req.body.email.trim();
  }

  // 🏠 Check if Address was sent (allows adding an address later, or clearing it completely)
  if (req.body.address !== undefined) {
    updateFields.address = req.body.address.trim();
  }

  // Update customer record in MongoDB
  const updatedCustomer = await Customer.findOneAndUpdate(
    {
      _id: customerId,
      createdBy: ownerId, // Ensures the right shop owner is updating their own customer
    },
    {
      $set: updateFields, // Saves only the fields that were changed or added
    },
    {
      new: true,          // Returns the fresh, newly updated data to the frontend
      runValidators: true,
    }
  ).lean();

  if (!updatedCustomer) {
    throw new ApiError(404, "Customer not found");
  }

  // Send the clean updated customer profile back to your frontend
  res.status(200).json(
    new ApiResponse(
      200,
      updatedCustomer,
      "Customer details updated successfully"
    )
  );
});

// ✅ Delete customer
export const deleteCustomer = asyncHandler(async (req, res) => {
  const ownerId = getOwnerId(req.user);
  const { customerId } = req.params;

  const customer = await Customer.findOneAndDelete({ _id: customerId, createdBy: ownerId }).lean();
  if (!customer) throw new ApiError(404, "Customer not found");

  res.status(200).json(new ApiResponse(200, { customerId: customer._id, name: customer.name }, "Customer deleted"));
});

// ✅ Top customers
export const getTopCustomers = asyncHandler(async (req, res) => {

  const ownerId = getOwnerId(req.user);

  // Pagination
  const page = Math.max(Number(req.query.page) || 1, 1);

  const limit = Math.min(Number(req.query.limit) || 10, 50);

  const skip = (page - 1) * limit;

  // Aggregation pipeline
  const topCustomers = await Order.aggregate([

    // Step 1 → Filter early
    {
      $match: {
        status: "Completed",
        createdBy: ownerId,
      },
    },

    // Step 2 → Group orders by customer
    {
      $group: {
        _id: "$customer",
        totalSpent: {
          $sum: "$totalAmount",
        },
        totalOrders: {
          $sum: 1,
        },
      },
    },

    // Step 3 → Sort by highest spending
    {
      $sort: {
        totalSpent: -1,
      },
    },

    // Step 4 → Pagination
    {
      $skip: skip,
    },

    {
      $limit: limit,
    },

    // Step 5 → Join customer data
    {
      $lookup: {
        from: "customers",
        localField: "_id",
        foreignField: "_id",
        as: "customer",
      },
    },

    // Step 6 → Convert array → object
    {
      $unwind: "$customer",
    },

    // Step 7 → Final response structure
    {
      $project: {
        _id: 0,
        customerId: "$customer.customerId",
        name: "$customer.name",
        totalSpent: 1,
        totalOrders: 1,
      },
    },
  ]);

  // Total top customers count
  const totalCustomers = await Order.aggregate([

    {
      $match: {
        status: "Completed",
        createdBy: ownerId,
      },
    },

    {
      $group: {
        _id: "$customer",
      },
    },

    {
      $count: "total",
    },
  ]);

  const total =
    totalCustomers[0]?.total || 0;

  // Response
  res.status(200).json(
    new ApiResponse(
      200,
      {
        topCustomers,
        pagination: {
          totalCustomers: total,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          limit,
        },
      },
      "Top customers fetched successfully"
    )
  );
});

// ✅ Recent customers
// export const getRecentCustomers = asyncHandler(async (req, res) => {
//   const ownerId = getOwnerId(req.user);
//   const days = parseInt(req.query.days) || 7;

//   const since = new Date();
//   since.setDate(since.getDate() - days);

//   const customers = await Customer.find({
//     createdBy: ownerId,
//     createdAt: { $gte: since },
//   }).sort({ createdAt: -1 });

//   res.status(200).json(
//     new ApiResponse(200, customers, `Customers added in last ${days} days`)
//   );
// });
export const getRecentCustomers = asyncHandler(async (req, res) => {

  const ownerId = getOwnerId(req.user);

  // Pagination
  const page = Math.max(Number(req.query.page) || 1, 1);

  const limit = Math.min(Number(req.query.limit) || 10, 50);

  // Days validation
  const days = Math.min(
    Math.max(parseInt(req.query.days) || 7, 1),
    365
  );

  // Create cutoff date
  const since = new Date();

  since.setDate(since.getDate() - days);

  // Query
  const query = {
    createdBy: ownerId,
    createdAt: {
      $gte: since,
    },
  };

  // Fetch customers
  const customers = await Customer.find(query)
    .select("customerId name phone email createdAt")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  // Total count
  const totalCustomers = await Customer.countDocuments(query);

  // Response
  res.status(200).json(
    new ApiResponse(
      200,
      {
        customers,
        pagination: {
          totalCustomers,
          currentPage: page,
          totalPages: Math.ceil(totalCustomers / limit),
          limit,
        },
      },
      `Customers added in last ${days} days`
    )
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
// export const getCustomersWithoutOrders = asyncHandler(async (req, res) => {
//   const ownerId = getOwnerId(req.user);


//     // Pagination
//   const page = Math.max(Number(req.query.page) || 1, 1);

//   const limit = Math.min(Number(req.query.limit) || 10, 50);


//   const customersWithOrders = await Order.distinct("customer", { createdBy: ownerId });

//   const customers = await Customer.find({
//     _id: { $nin: customersWithOrders },
//     createdBy: ownerId,
//   })  .select("customerId name phone email createdAt")
//     .sort({ createdAt: -1 })
//     .skip((page - 1) * limit)
//     .limit(limit)
//     .lean();

//   res.status(200).json(new ApiResponse(200, {customers,        pagination: {
//           totalCustomers,
//           currentPage: page,
//           totalPages: Math.ceil(totalCustomers / limit),
//           limit,
//         },}, "Customers with no orders"));
// });
export const getCustomersWithoutOrders = asyncHandler(async (req, res) => {

  const ownerId = getOwnerId(req.user);

  // Pagination
  const page = Math.max(Number(req.query.page) || 1, 1);

  const limit = Math.min(Number(req.query.limit) || 10, 50);

  // Get customer IDs who placed orders
  const customersWithOrders = await Order.distinct(
    "customer",
    {
      createdBy: ownerId,
    }
  );

  // Query object
  const query = {
    _id: {
      $nin: customersWithOrders,
    },
    createdBy: ownerId,
  };

  // Fetch customers
  const customers = await Customer.find(query)
    .select("customerId name phone email createdAt")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  // Total count
  const totalCustomers = await Customer.countDocuments(query);

  // Response
  res.status(200).json(
    new ApiResponse(
      200,
      {
        customers,
        pagination: {
          totalCustomers,
          currentPage: page,
          totalPages: Math.ceil(totalCustomers / limit),
          limit,
        },
      },
      "Customers with no orders fetched successfully"
    )
  ); 
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
