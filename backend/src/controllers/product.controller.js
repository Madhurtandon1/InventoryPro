import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary} from "../utils/cloudinary.js"
import { Product } from "../models/products.model.js";
import { getEffectiveUserId } from "../utils/getEffectiveUserId.js";



export const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, price, quantity, description, category, supplier } = req.body;

  if (!name || !sku || !price || !quantity) {
    throw new ApiError(400, "Name, SKU, price, and quantity are required");
  }

  // Check for existing SKU
const existingProduct = await Product.findOne({ sku, createdBy: req.user._id });
  if (existingProduct) {
    throw new ApiError(409, "Product with this SKU already exists");
  }

const imageLocalPath = req.files?.image?.[0]?.path;

if (!imageLocalPath) {
  throw new ApiError(400, "Product image is required");
}

const image = await uploadOnCloudinary(imageLocalPath);

if (!image?.url) {
  throw new ApiError(400, "Image upload failed");
}

  // Create new product
  const product = await Product.create({
    name,
    sku,
    price,
    quantity,
    description,
    category,
    supplier,
    image: image.url ,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});


export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find product owned by user
  const product = await Product.findOne({ _id: id, createdBy: req.user._id });
  if (!product) {
    throw new ApiError(404, "Product not found or not authorized");
  }

  const {
    name,
    sku,
    price,
    quantity,
    description,
    category,
    supplier
  } = req.body;

  // Optional image replacement
  if (req.files?.image?.[0]?.path) {
    // Upload new image
    const imageUpload = await uploadOnCloudinary(req.files.image[0].path);

    if (!imageUpload?.url) {
      throw new ApiError(500, "Image upload failed");
    }

    // Delete old image from Cloudinary if needed
    if (product.image) {
      await deleteFromCloudinary(product.image); // works if image is stored as full URL
    }

    product.image = imageUpload.url;
  }

  // Update only provided fields
  if (name) product.name = name;
  if (sku) product.sku = sku;
  if (price) product.price = price;
  if (quantity) product.quantity = quantity;
  if (description) product.description = description;
  if (category) product.category = category;
  if (supplier) product.supplier = supplier;

  await product.save();

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"));
});


export const deleteProduct = asyncHandler(async (req, res) => {

  const { productId} = req.params
  const userId = req.user._id

  const product = await Product.findById(productId)

  if(!product){
    throw new ApiError(404, "Product not found")
  }

  if (product.createdBy.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this product");
  }
if (product.image) {
    await deleteFromCloudinary(product.image);
  }
    await product.deleteOne()
  res
  .status(200)
  .json(new ApiResponse(200, " product deleted successfully "))
    //TODO: delete video
})


export const getAllProducts = asyncHandler(async (req, res) => {
  const { lowStock, category, search } = req.query;

  const createdBy = getEffectiveUserId(req.user); // 🧠 support admin/staff
  const query = { createdBy };

  if (lowStock === "true") {
    query.quantity = { $lte: 5 };
  }

  if (category) {
    query.category = category;
  }

  if (search) {
    const regex = new RegExp(search, "i");
    query.$or = [{ name: regex }, { sku: regex }];
  }

  const products = await Product.find(query).sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, products, "Filtered products fetched")
  );
});




export const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
});


export const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findOne({
    _id: productId,
    createdBy: req.user._id,
  });

  if (!product) {
    throw new ApiError(404, "Product not found or not authorized");
  }

  return res.status(200).json(
    new ApiResponse(200, product, "Product fetched successfully")
  );
});


export const getLowStockProducts = asyncHandler(async (req, res) => {
  const threshold = 5;
  const products = await Product.find({ createdBy: req.user._id, quantity: { $lt: threshold } });

  res.status(200).json(new ApiResponse(200, products, "Low stock products fetched"));
});

export const getOutOfStockProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ createdBy: req.user._id, quantity: 0 });
  res.status(200).json(new ApiResponse(200, products, "Out-of-stock products fetched"));
});

export const updateStock = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  const product = await Product.findOne({ _id: productId, createdBy: req.user._id });
  if (!product) throw new ApiError(404, "Product not found");

  product.quantity = quantity;
  await product.save();

  res.status(200).json(new ApiResponse(200, product, "Stock updated"));
});


export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct("category", { createdBy: req.user._id });
  res.status(200).json(new ApiResponse(200, categories, "All categories fetched"));
});


