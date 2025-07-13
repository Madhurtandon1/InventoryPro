import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const authorizeRoles = (...allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new ApiError(403, "Forbidden: You do not have permission to access this resource");
    }

    next();
  });
};
