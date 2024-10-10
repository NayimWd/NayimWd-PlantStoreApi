import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = (req as any).user;

  if (!user) {
    throw new ApiError(404, "Invalid Token, user not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "current user fetched successfully"));
});
