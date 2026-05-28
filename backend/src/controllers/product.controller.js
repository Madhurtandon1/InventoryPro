import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/products.model.js";
import { getEffectiveUserId } from "../utils/getEffectiveUserId.js";



// export const createProduct = asyncHandler(async (req, res) => {
//   const { name, sku, price, quantity, description, category, supplier } = req.body;

//   if (!name || !sku || !price || !quantity) {
//     throw new ApiError(400, "Name, SKU, price, and quantity are required");
//   }

//   // Check for existing SKU
// const existingProduct = await Product.exists({ sku, createdBy: req.user._id });
//   if (existingProduct) {
//     throw new ApiError(409, "Product with this SKU already exists");
//   }
//   // Create new product
//   const product = await Product.create({
//     name,
//     sku,
//     price,
//     quantity,
//     description,
//     category,
//     supplier,
    
//     createdBy: req.user._id,
//   });

//   return res
//     .status(201)
//     .json(new ApiResponse(201, product, "Product created successfully"));
// });
export const createProduct = asyncHandler(async (req, res) => {

  let {
    name,
    sku,
    price,
    quantity,
    description,
    category,
    supplier,
  } = req.body;

  // Input sanitization
  name = name?.trim();
  sku = sku?.trim().toUpperCase();
  description = description?.trim();
  category = category?.trim();
  supplier = supplier?.trim();

  // Validation
  if (
    !name ||
    !sku ||
    price == null ||
    quantity == null
  ) {
    throw new ApiError(
      400,
      "Name, SKU, price, and quantity are required"
    );
  }

  // Numeric validation
  if (price <= 0) {
    throw new ApiError(
      400,
      "Price must be greater than 0"
    );
  }

  if (quantity < 0) {
    throw new ApiError(
      400,
      "Quantity cannot be negative"
    );
  }

  // Duplicate SKU check
  const existingProduct =
    await Product.exists({
      sku,
      createdBy: req.user._id,
    });

  if (existingProduct) {
    throw new ApiError(
      409,
      "Product with this SKU already exists"
    );
  }

  // Create product
  const product = await Product.create({
    name,
    sku,
    price,
    quantity,
    description,
    category,
    supplier,
    createdBy: req.user._id,
  });

  // Response payload
  const productResponse = {
    _id: product._id,
    name: product.name,
    sku: product.sku,
    price: product.price,
    quantity: product.quantity,
    category: product.category,
  };

  // Response
  return res.status(201).json(
    new ApiResponse(
      201,
      productResponse,
      "Product created successfully"
    )
  );
});

// export const updateProduct = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   // Find product owned by user
//   const product = await Product.findOne({ _id: id, createdBy: req.user._id });
//   if (!product) {
//     throw new ApiError(404, "Product not found or not authorized");
//   }

//   const {
//     name,
//     sku,
//     price,
//     quantity,
//     description,
//     category,
//     supplier
//   } = req.body;

//   // Update only provided fields
//   if (name) product.name = name;
//   if (sku) product.sku = sku;
//   if (price) product.price = price;
//   if (quantity) product.quantity = quantity;
//   if (description) product.description = description;
//   if (category) product.category = category;
//   if (supplier) product.supplier = supplier;

//   await product.save();

//   return res
//     .status(200)
//     .json(new ApiResponse(200, product, "Product updated successfully"));
// });
export const updateProduct = asyncHandler(async (req, res) => {

  const { id } = req.params;

  let {
    name,
    sku,
    price,
    quantity,
    description,
    category,
    supplier,
  } = req.body;

  // Build update object
  const updateFields = {};

  if (name?.trim()) {
    updateFields.name = name.trim();
  }

  if (sku?.trim()) {
    updateFields.sku = sku.trim().toUpperCase();
  }

  if (price != null) {

    if (price <= 0) {
      throw new ApiError(
        400,
        "Price must be greater than 0"
      );
    }

    updateFields.price = price;
  }

  if (quantity != null) {

    if (quantity < 0) {
      throw new ApiError(
        400,
        "Quantity cannot be negative"
      );
    }

    updateFields.quantity = quantity;
  }

  if (description?.trim()) {
    updateFields.description =
      description.trim();
  }

  if (category?.trim()) {
    updateFields.category =
      category.trim();
  }

  if (supplier?.trim()) {
    updateFields.supplier =
      supplier.trim();
  }

  // Update product
  const updatedProduct =
    await Product.findOneAndUpdate(
      {
        _id: id,
        createdBy: req.user._id,
      },
      {
        $set: updateFields,
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

  // Not found
  if (!updatedProduct) {
    throw new ApiError(
      404,
      "Product not found or unauthorized"
    );
  }

  // Response
  return res.status(200).json(
    new ApiResponse(
      200,
      updatedProduct,
      "Product updated successfully"
    )
  );
});

// export const deleteProduct = asyncHandler(async (req, res) => {

//   const { productId} = req.params
//   const userId = req.user._id

//   const product = await Product.findById(productId)

//   if(!product){
//     throw new ApiError(404, "Product not found")
//   }

//   if (product.createdBy.toString() !== userId.toString()) {
//     throw new ApiError(403, "You are not authorized to delete this product");
//   }

//     await product.deleteOne()
//   res
//   .status(200)
//   .json(new ApiResponse(200, " product deleted successfully "))
//     //TODO: delete video
// })

export const deleteProduct = asyncHandler(async (req, res) => {

  const { productId } = req.params;

  // Delete product with ownership check
  const deletedProduct =
    await Product.findOneAndDelete({
      _id: productId,
      createdBy: req.user._id,
    }).lean();

  // Product not found
  if (!deletedProduct) {
    throw new ApiError(
      404,
      "Product not found or unauthorized"
    );
  }

  // Response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        productId: deletedProduct._id,
        name: deletedProduct.name,
        sku: deletedProduct.sku,
      },
      "Product deleted successfully"
    )
  );
});

// export const getAllProducts = asyncHandler(async (req, res) => {
//   const { lowStock, category, search } = req.query;

//   const createdBy = getEffectiveUserId(req.user); // 🧠 support admin/staff
//   const query = { createdBy };

//   if (lowStock === "true") {
//     query.quantity = { $lte: 5 };
//   }

//   if (category) {
//     query.category = category;
//   }

//   if (search) {
//     const regex = new RegExp(search, "i");
//     query.$or = [{ name: regex }, { sku: regex }];
//   }

//   const products = await Product.find(query).sort({ createdAt: -1 });

//   res.status(200).json(
//     new ApiResponse(200, products, "Filtered products fetched")
//   );
// });

export const getAllProducts = asyncHandler(async (req, res) => {

  const {
    lowStock,
    category,
    search,
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

  // Effective owner
  const createdBy =
    getEffectiveUserId(req.user);

  // Query object
  const query = {
    createdBy,
  };

  // Low stock filter
  if (lowStock === "true") {
    query.quantity = {
      $lte: 5,
    };
  }

  // Category filter
  if (category?.trim()) {
    query.category =
      category.trim();
  }

  // Search filter
  if (search?.trim()) {

    const regex = new RegExp(
      `^${search}`,
      "i"
    );

    query.$or = [
      { name: regex },
      { sku: regex },
    ];
  }

  // Fetch products
  const products = await Product.find(query)
    .select(
      "name sku quantity price category supplier createdAt"
    )
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  // Total count
  const totalProducts =
    await Product.countDocuments(query);

  // Response
  res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          totalProducts,
          currentPage: page,
          totalPages: Math.ceil(
            totalProducts / limit
          ),
          limit,
        },
      },
      "Filtered products fetched successfully"
    )
  );
});


// export const getSingleProduct = asyncHandler(async (req, res) => {
//   const product = await Product.findOne({
//     _id: req.params.id,
//     createdBy: req.user._id,
//   });

//   if (!product) {
//     throw new ApiError(404, "Product not found");
//   }

//   res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
// });

export const getSingleProduct = asyncHandler(async (req, res) => {

  const product = await Product.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  })
    .select(
      "name sku description price quantity category supplier createdAt"
    )
    .lean();

  // Product not found
  if (!product) {
    throw new ApiError(
      404,
      "Product not found"
    );
  }

  // Response
  return res.status(200).json(
    new ApiResponse(
      200,
      product,
      "Product fetched successfully"
    )
  );
});


export const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findOne({
    _id: productId,
    createdBy: req.user._id,
  }).select(
      "name sku description price quantity category supplier createdAt"
    )
    .lean();


  if (!product) {
    throw new ApiError(404, "Product not found or not authorized");
  }

  return res.status(200).json(
    new ApiResponse(200, product, "Product fetched successfully")
  );
});


// export const getLowStockProducts = asyncHandler(async (req, res) => {
//   const threshold = 5;
//   const products = await Product.find({ createdBy: req.user._id, quantity: { $lt: threshold } }).select(
//       "name sku description price quantity category supplier createdAt"
//     )
//     .lean();
// ;

//   res.status(200).json(new ApiResponse(200, products, "Low stock products fetched"));
// });

export const getLowStockProducts = asyncHandler(async (req, res) => {

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

  // Dynamic threshold
  const threshold = Math.max(
    Number(req.query.threshold) || 5,
    1
  );

  // Query object
  const query = {
    createdBy: req.user._id,
    quantity: {
      $lt: threshold,
    },
  };

  // Fetch products
  const products = await Product.find(query)
    .select(
      "name sku quantity price category supplier createdAt"
    )
    .sort({ quantity: 1 })
    .skip(skip)
    .limit(limit)
    .lean();

  // Total count
  const totalProducts =
    await Product.countDocuments(query);

  // Response
  res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          totalProducts,
          currentPage: page,
          totalPages: Math.ceil(
            totalProducts / limit
          ),
          limit,
        },
      },
      "Low stock products fetched successfully"
    )
  );
});

// export const getOutOfStockProducts = asyncHandler(async (req, res) => {

// const page = Math.max(
//     Number(req.query.page) || 1,
//     1
//   );

//   const limit = Math.min(
//     Number(req.query.limit) || 10,
//     50
//   );

//   const skip = (page - 1) * limit;

//   // Dynamic threshold
//   const threshold = Math.max(
//     Number(req.query.threshold) || 5,
//     1
//   );
//       // Query object
//   const query = {
//     createdBy: req.user._id,
//     quantity: {
//       $lt: 0,
//     },
//   };

//  // Fetch products
//   const products = await Product.find(query)
//     .select(
//       "name sku quantity price category supplier createdAt"
//     )
//     .sort({ quantity: 1 })
//     .skip(skip)
//     .limit(limit)
//     .lean();  
    
    
//   const totalProducts =
//     await Product.countDocuments(query);

//   // Response
//   res.status(200).json(
//     new ApiResponse(
//       200,
//       {
//         products,
//         pagination: {
//           totalProducts,
//           currentPage: page,
//           totalPages: Math.ceil(
//             totalProducts / limit
//           ),
//           limit,
//         },
//       },
//       "Low stock products fetched successfully"
//     )
//   );
// });
export const getOutOfStockProducts = asyncHandler(async (req, res) => {

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

  // Query object
  const query = {
    createdBy: req.user._id,
    quantity: 0,
  };

  // Fetch products
  const products = await Product.find(query)
    .select(
      "name sku quantity price category supplier createdAt"
    )
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  // Total count
  const totalProducts =
    await Product.countDocuments(query);

  // Response
  res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          totalProducts,
          currentPage: page,
          totalPages: Math.ceil(
            totalProducts / limit
          ),
          limit,
        },
      },
      "Out of stock products fetched successfully"
    )
  );
});
// export const updateStock = asyncHandler(async (req, res) => {
//   const { productId } = req.params;
//   const { quantity } = req.body;

//   const product = await Product.findOne({ _id: productId, createdBy: req.user._id });
//   if (!product) throw new ApiError(404, "Product not found");

//   product.quantity = quantity;
//   await product.save();

//   res.status(200).json(new ApiResponse(200, product, "Stock updated"));
// });

export const updateStock = asyncHandler(async (req, res) => {

  const { productId } = req.params;

  const { quantity } = req.body;

  // Validation
  if (quantity == null) {
    throw new ApiError(
      400,
      "Quantity is required"
    );
  }

  // Prevent invalid stock
  if (quantity < 0) {
    throw new ApiError(
      400,
      "Quantity cannot be negative"
    );
  }

  // Update stock
  const updatedProduct =
    await Product.findOneAndUpdate(
      {
        _id: productId,
        createdBy: req.user._id,
      },
      {
        $set: {
          quantity,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .select(
        "name sku quantity price category updatedAt"
      )
      .lean();

  // Product not found
  if (!updatedProduct) {
    throw new ApiError(
      404,
      "Product not found"
    );
  }

  // Response
  return res.status(200).json(
    new ApiResponse(
      200,
      updatedProduct,
      "Stock updated successfully"
    )
  );
});


// export const getAllCategories = asyncHandler(async (req, res) => {
//   const categories = await Product.distinct("category", { createdBy: req.user._id });
//   res.status(200).json(new ApiResponse(200, categories, "All categories fetched"));
// });

export const getAllCategories = asyncHandler(async (req, res) => {

  // Fetch unique categories
  const categories =
    await Product.distinct(
      "category",
      {
        createdBy: req.user._id,
        category: {
          $ne: null,
        },
      }
    );

  // Sort alphabetically
  categories.sort();

  // Response
  return res.status(200).json(
    new ApiResponse(
      200,
      categories,
      "All categories fetched successfully"
    )
  );
});


