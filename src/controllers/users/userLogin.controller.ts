import { User } from "../../models/userModel/user.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

//reusable method for generate access and refresh token
const generateAccessAndRefreshToken = async (userId: string) => {
  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }
    // Generate access and refresh tokens by invoking the methods
    const accessToken = await user?.generateAccessToken();
    const refreshToken = await user?.generateRefreshToken();

    // Add refreshToken to user schema
    user.refreshToken = refreshToken;

    //setting validate before save to false
    await user?.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

export const loginUser = asyncHandler(async (req, res) => {
  // getting email and password
  const { email, password } = req.body;
  // checking for email and password
  if (!email || !password) {
    throw new ApiError(400, "email or password are required");
  }

  // check existing user
  const existingUser = await User.findOne({ email });

  // validate user
  if (!existingUser) {
    throw new ApiError(404, "user does not exist");
  }

  // checking for password
  const validPassword = await existingUser.isPasswordCorrect(password);

  if (!validPassword) {
    throw new ApiError(401, "Invalid password");
  }

  // generating tokengs
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    existingUser?._id
  );

  // Convert the Mongoose document to a plain object and omit sensitive fields
  const {
    password: _,
    refreshToken: __,
    ...loginUser
  } = existingUser.toObject();

  // cookie
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loginUser,
          accessToken,
          refreshToken,
        },
        "User Logged In Successfully"
      )
    );
});
