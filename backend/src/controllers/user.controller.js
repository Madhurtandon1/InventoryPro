import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail.js";


//  Helper to set refresh token cookie
const sendRefreshToken = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

//  REGISTER USER
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, adminPasscode } = req.body;

  if (!username || !email || !password || !adminPasscode) {
    throw new ApiError(400, "All fields including admin passcode are required");
  }

  // Check if user already exists (globally for admins)
  const userExists = await User.findOne({ $or: [{ username }, { email }] });
  if (userExists) {
    throw new ApiError(409, "Username or email already exists");
  }

  // Create user with role=admin (by default), and store the passcode
  const newUser = await User.create({
    username,
    email,
    password,
    adminPasscode,
    role: "admin", // enforced
    createdBy: null // shop owner
  });

  const accessToken = newUser.generateAccessToken();
  const refreshToken = newUser.generateRefreshToken();

  newUser.refreshToken = refreshToken;
  await newUser.save({ validateBeforeSave: false });

  sendRefreshToken(res, refreshToken);

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
        accessToken,
      },
      "Admin registered successfully"
    )
  );
});


// LOGIN USER
export const loginUser = asyncHandler(async (req, res) => {
  const { username, password, role, adminPasscode } = req.body;

  if (!username || !password || !role) {
    throw new ApiError(400, "Username, password, and role are required");
  }

  const user = await User.findOne({ username }).select("+adminPasscode");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role !== role) {
    throw new ApiError(403, `This user is not registered as ${role}`);
  }

  if (role === "admin") {
    if (!adminPasscode) {
      throw new ApiError(400, "Admin passcode is required for admin login");
    }

    const isAdminPasswordValid = await user.isPasswordCorrect(password);
    const isAdminPasscodeValid = await user.isAdminPasscodeCorrect(adminPasscode);

    if (!isAdminPasswordValid || !isAdminPasscodeValid) {
      throw new ApiError(401, "Invalid admin password or passcode");
    }
  }

  if (role === "staff") {
    if (!user.createdBy) {
      throw new ApiError(403, "Staff not linked to any shop");
    }

    const admin = await User.findById(user.createdBy);
    if (!admin) {
      throw new ApiError(403, "Linked admin not found");
    }

    const isPasswordMatch = await admin.isPasswordCorrect(password);
    if (!isPasswordMatch) {
      throw new ApiError(401, "Invalid password (admin's password required)");
    }
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  sendRefreshToken(res, refreshToken);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        accessToken,
        refreshToken,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
      "Login successful"
    )
  );
});



//  LOGOUT USER
export const logoutUser = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// REFRESH ACCESS TOKEN
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken) {
    throw new ApiError(401, "No refresh token provided");
  }

  const refreshToken = cookies.refreshToken;

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decoded._id);

  if (!user || user.refreshToken !== refreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const newAccessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  sendRefreshToken(res, newRefreshToken);

  return res.status(200).json(
    new ApiResponse(200, {
      accessToken: newAccessToken,
    }, "Access token refreshed")
  );
});

//  GET PROFILE
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, user, "User profile fetched")
  );
});

export const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Both old and new passwords are required");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await user.isPasswordCorrect(oldPassword);

  if (!isMatch) {
    throw new ApiError(401, "Old password is incorrect");
  }

  user.password = newPassword;
  await user.save(); // pre-save hook will hash the new password

  return res.status(200).json(
    new ApiResponse(200, {}, "Password changed successfully")
  );
});

export const updateAccountDetails = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  const userId = req.user?._id;

  const updateData = {};

  if (username) updateData.username = username.trim();
  if (email) {
    const emailExists = await User.findOne({ email, _id: { $ne: userId } });
    if (emailExists) {
      throw new ApiError(409, "Email already in use by another user");
    }
    updateData.email = email.trim();
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select("-password");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Account details updated successfully"));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) throw new ApiError(400, "Email is required");

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new ApiError(404, "User not found");

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save({ validateBeforeSave: false });

const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const message = `
    <h3>Reset Your Password</h3>
    <p>Click the link below to reset your password. This link expires in 15 minutes:</p>
    <a href="${resetUrl}" target="_blank">${resetUrl}</a>
  `;

  try {
    await sendEmail(user.email, "Password Reset Request", message);

    return res.status(200).json(
      new ApiResponse(200, {}, "Reset password email sent")
    );
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    throw new ApiError(500, "Failed to send reset email. Please try again.");
  }
});


export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) throw new ApiError(400, "Invalid or expired token");

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.refreshToken = undefined; 
  await user.save();

    res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json(
    new ApiResponse(200, {}, "Password has been reset successfully")
  );
});


export const forgotAdminPasscode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) throw new ApiError(400, "Email is required");

  const user = await User.findOne({ email: email.toLowerCase(), role: "admin" });

  if (!user) throw new ApiError(404, "Admin user not found");

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-admin-passcode/${resetToken}`;

  const message = `
    <h3>Reset Your Admin Passcode</h3>
    <p>Click the link below to reset your admin passcode. This link expires in 15 minutes:</p>
    <a href="${resetUrl}" target="_blank">${resetUrl}</a>
  `;

  try {
    await sendEmail(user.email, "Reset Admin Passcode Request", message);
    return res.status(200).json(new ApiResponse(200, {}, "Reset link sent to email"));
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, "Failed to send email. Try again.");
  }
});

export const resetAdminPasscode = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPasscode } = req.body;

  if (!newPasscode) throw new ApiError(400, "New admin passcode is required");

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
    role: "admin",
  });

  if (!user) throw new ApiError(400, "Invalid or expired token");

  user.adminPasscode = newPasscode;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.refreshToken = undefined;
  await user.save();

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Admin passcode has been reset successfully"));
});



export const updateAdminPasscode = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { oldPasscode, newPasscode } = req.body;

  if (!oldPasscode || !newPasscode) {
    throw new ApiError(400, "Old and new admin passcodes are required");
  }

  const user = await User.findById(userId).select("+adminPasscode");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role !== "admin") {
    throw new ApiError(403, "Only admins can update admin passcode");
  }

  const isMatch = await user.isAdminPasscodeCorrect(oldPasscode);

  if (!isMatch) {
    throw new ApiError(401, "Old admin passcode is incorrect");
  }

  user.adminPasscode = newPasscode;
  await user.save(); // will be hashed automatically in pre-save hook

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Admin passcode updated successfully"));
});


export const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { password } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch) throw new ApiError(401, "Incorrect password");


  await User.findByIdAndDelete(userId);

  // Optional: clear auth cookies if using cookies
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json(
    new ApiResponse(200, {}, "Account deleted successfully")
  );
});

export const registerStaff = asyncHandler(async (req, res) => {
  const { username, email } = req.body;

  if (req.user.role !== "admin") {
    throw new ApiError(403, "Only admins can create staff");
  }

  if (!username || !email) {
    throw new ApiError(400, "Username and email are required");
  }

  // Ensure unique username/email per shop
  const existingUser = await User.findOne({
    $or: [
      { username, createdBy: req.user._id },
      { email, createdBy: req.user._id },
    ],
  });

  if (existingUser) {
    throw new ApiError(409, "Staff with this username or email already exists in your shop");
  }

  const newStaff = await User.create({
    username,
    email,
    role: "staff",
    createdBy: req.user._id,
    // password intentionally omitted
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        _id: newStaff._id,
        username: newStaff.username,
        email: newStaff.email,
        role: newStaff.role,
      },
      "Staff registered successfully"
    )
  );
});


export const getMyStaff = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Only admins can view their staff");
  }

  const { search, page = 1, limit = 10 } = req.query;

  const filter = {
    createdBy: req.user._id,
    role: "staff",
  };

  if (search) {
    const regex = new RegExp(search, "i");
    filter.$or = [
      { username: regex },
      { email: regex },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const staff = await User.find(filter)
    .select("-password")
    .skip(skip)
    .limit(Number(limit));

  const total = await User.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        staff,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      },
      "Staff users fetched"
    )
  );
});

export const updateStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;

  if (!username || !email) {
    throw new ApiError(400, "Username and email are required");
  }

  const staff = await User.findOne({
    _id: id,
    role: "staff",
    createdBy: req.user._id,
  });

  if (!staff) {
    throw new ApiError(404, "Staff member not found");
  }

  // Check for uniqueness in the same shop
  const existing = await User.findOne({
    $or: [{ username }, { email }],
    _id: { $ne: id },
    createdBy: req.user._id,
  });

  if (existing) {
    throw new ApiError(409, "Username or email already exists in your shop");
  }

  staff.username = username;
  staff.email = email;

  await staff.save();

  return res.status(200).json(
    new ApiResponse(200, {
      _id: staff._id,
      username: staff.username,
      email: staff.email,
    }, "Staff updated successfully")
  );
});

export const deleteStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const staff = await User.findOne({
    _id: id,
    role: "staff",
    createdBy: req.user._id,
  });

  if (!staff) {
    throw new ApiError(404, "Staff member not found");
  }

  await User.findByIdAndDelete(id);

  return res.status(200).json(
    new ApiResponse(200, {}, "Staff deleted successfully")
  );
});

