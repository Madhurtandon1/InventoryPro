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
        quantity: { type: Number, required: true, min:1 },
        priceAtPurchase: {type: Number, required: true, min: 0,},
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
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
orderSchema.index({
  createdBy: 1,
  customer: 1,
  createdAt: -1
});
orderSchema.index({
  createdBy: 1,
  status: 1,
  createdAt: -1
});
orderSchema.index({
  createdBy: 1,
  createdAt: -1
});
export const Order = mongoose.model("Order", orderSchema);

