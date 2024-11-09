import { User } from "../../models/userModel/user.model";
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

export const getAllUsers = asyncHandler(async (req, res) => {
  const user = (req as any).user;

  if (!user) {
    throw new ApiError(404, "Invalid Token, user not found");
  }

  if (user.role !== "admin") {
    throw new ApiError(401, "Unauthorized request");
  }

  // Adding pagination, searching, and sorting
  const page = parseInt((req as any).query.page as string) || 1;
  const limit = parseInt((req as any).query.limit as string) || 15;
  const nameSearch = (req as any).query.name
    ? { name: { $regex: (req as any).query.name, $options: "i" } }
    : {};
  const emailSearch = (req as any).query.email
    ? { email: { $regex: (req as any).query.email, $options: "i" } }
    : {};
  const sortField = (req as any).query.sortField || "name";
  const sortOrder = (req as any).query.sortOrder === "desc" ? -1 : 1;

  // Combining search query
  const matchQuery = {
    ...nameSearch,
    ...emailSearch,
  };

  // Aggregation pipeline stages
  const pipeline: any[] = [];

  // Match stage for filtering users
  pipeline.push({ $match: matchQuery });

  // Sort stage
  pipeline.push({ $sort: { [sortField]: sortOrder } });

  // Pagination stages
  const skip = (page - 1) * limit;
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limit });

  // Getting total users count by search query
  const totalUsers = await User.countDocuments(matchQuery);

  // Execute aggregation
  const allUsers = await User.aggregate(pipeline);



  return res.status(200).json(
    new ApiResponse(
      200,
      {
        All_users: allUsers.length,
        users: allUsers,
        pagination: {
          totalUsers,
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
        },
      },
      "All users fetched successfully"
    )
  );
});
