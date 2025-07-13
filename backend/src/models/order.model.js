// models/order.model.js
import { Schema } from "mongoose";
import mongoose  from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        priceAtPurchase: { type: Number, required: true },
      },
    ],
    totalAmount: Number,
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Completed",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Ensure uniqueness per admin
orderSchema.index({ createdBy: 1, orderNumber: 1 }, { unique: true });

export const Order = mongoose.model("Order", orderSchema);

