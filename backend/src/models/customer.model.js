// models/customer.model.js
import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
    },
    name: { type: String, required: true,trim: true },
    phone: { type: String },
    email: { type: String, lowercase: true, },
    address: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// 🔒 Ensure unique customerId per shop owner
customerSchema.index(
  {
    createdBy: 1,
    customerId: 1
  },
  { unique: true }
);

customerSchema.index({
  createdBy: 1,
  createdAt: -1
});

customerSchema.index({
  createdBy: 1,
  name: 1
});
export const Customer = mongoose.model("Customer", customerSchema);
