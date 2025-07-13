// models/customerCounter.model.js
import mongoose from "mongoose";

const customerCounterSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  customerSeq: {
    type: Number,
    default: 0,
  },
});

export const CustomerCounter = mongoose.model("CustomerCounter", customerCounterSchema);
