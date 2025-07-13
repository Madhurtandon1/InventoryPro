import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    password: {
  type: String,
  required: function () {
    return this.role === "admin";
  },
},

    role: {
      type: String,
      enum: ["admin", "staff"],
      default: "admin",
    },
    adminPasscode: {
      type: String,
      select: false, // don't return this in queries unless explicitly selected
    },

    refreshToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // If null, the user is an admin (shop owner)
    },
  },
  { timestamps: true }
);

// 🔐 Compound unique indexes to ensure uniqueness within a shop
userSchema.index({ username: 1, createdBy: 1 }, { unique: true });
userSchema.index({ email: 1, createdBy: 1 }, { unique: true });

// 🔒 Hash password before save
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  if (this.isModified("adminPasscode") && this.adminPasscode) {
    this.adminPasscode = await bcrypt.hash(this.adminPasscode, 10);
  }

  next();
});


// 🔐 Check password validity
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.isAdminPasscodeCorrect = async function (inputPasscode) {
  return await bcrypt.compare(inputPasscode, this.adminPasscode);
};



// 🔑 Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// 🔑 Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
