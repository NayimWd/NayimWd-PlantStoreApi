import { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { User } from "../../models/userModel/user.model";
import { uploadOnCloudinary } from "../../utils/cloudinary";

// user register
export const register = asyncHandler(async (req: Request, res: Response) => {
   
  const { name, email, password, phoneNumber } = req.body; // validation done with zod

  // check existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
      throw new ApiError(409, "Email already exists!");
    }
  // prevent duplicate number
  const existingNumber = await User.findOne({phoneNumber});
  if (existingNumber) {
    throw new ApiError(409, "Phone number already exists!");
  }

  // Access avatar file (special for ts)
  const avatarLocalPath = Array.isArray(req.files)
    ? req.files?.[0]?.path // For single file uploads
    : req.files?.avatar?.[0]?.path; // For field-based uploads

  // checking avater url
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // uploading on cloudinary
  const avater = await uploadOnCloudinary(avatarLocalPath);


  // validation avater
  if (!avater) {
    throw new ApiError(400, "Avatar file is required");
  }

  const register = await User.create({
    name,
    email,
    password,
    phoneNumber,
    avatar: avater.url,
  });

  // cheking user created or not
  const createdUser = await User.findById(register._id).select(
    "-password -refreshToken"
  );
  // validation - if user creation failed
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while user register");
  }

  // returning api response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registerd successfully"));
});


