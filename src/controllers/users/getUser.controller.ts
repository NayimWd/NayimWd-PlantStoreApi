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


export const getAllUsers = asyncHandler(async(req, res)=>{
  const user = (req as any).user;

  if (!user) {
    throw new ApiError(404, "Invalid Token, user not found");
  }

 if(user.role !== "admin"){
  throw new ApiError(401, "UnAuthorized request")
 }

 // adding pagination searching and sorting 
 const page = parseInt((req as any).query.page as string) || 1;
 const limit = parseInt((req as any).query.limit as string) || 10;
 const nameSearch = (req as any).query.name ? {name: {$regex: (req as any).query.name, $options: "i"}} : {}
 const emailSearch = (req as any).query.email ? {email: {$regex: (req as any).query.email, $options: "i"}} : {}
 const sortField = (req as any).query.sortField || "name";
 const sortOrder = (req as any).query.sortOrder === "desc" ? -1 : 1;


 //combining search query
 const searchQuery = {
  ...nameSearch,
  ...emailSearch,
 }


 // getting total users count by search query
 const totalUsers = await User.countDocuments(searchQuery);

 const allUsers = await User.find(searchQuery)
                            .sort({[sortField]: sortOrder})
                            .skip((page - 1) * limit)
                            .limit(limit)

 return res 
        .status(200)
        .json(
          new ApiResponse(
            200,
            {
              All_users: allUsers.length,
              users: allUsers,
              pagination: {
                totalUsers,
                currentPage: page,
                totalPages: Math.ceil(totalUsers / limit)
              }
            },
            "All Users fatched successfull"
          )
        )

})