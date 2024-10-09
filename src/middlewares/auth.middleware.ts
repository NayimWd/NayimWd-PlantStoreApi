import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/userModel/user.model";

dotenv.config();

export const veryfyJWT = asyncHandler(async (req, res, next) => {
  // Get token from cookie or request header
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  // Check for the token
  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  // Ensure the secret key is available
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret) {
    throw new ApiError(500, "Access token secret not configured");
  }

  let decodedToken;

  try {
    // Verify token
    decodedToken = jwt.verify(token, accessTokenSecret);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
  }

  // Find the user by decoded token ID
  const user = await User.findById((decodedToken as any)._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  // Attach the user to the request
  req.user = user;

  next();
});
