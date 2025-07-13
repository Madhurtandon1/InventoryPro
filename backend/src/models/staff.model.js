// models/staff.model.js
import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin/shop owner
      required: true,
    },
    role: {
      type: String,
      enum: ["staff"],
      default: "staff",
    },
  },
  { timestamps: true }
);

export const Staff = mongoose.model("Staff", staffSchema);
