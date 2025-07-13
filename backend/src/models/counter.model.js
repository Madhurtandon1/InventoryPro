import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  sequences: {
    order: { type: Number, default: 0 },
    customer: { type: Number, default: 0 },
    // ✅ Add more sequences in future if needed
    // invoice: { type: Number, default: 0 },
    // purchase: { type: Number, default: 0 },
  },
});

export const Counter = mongoose.model("Counter", counterSchema);



