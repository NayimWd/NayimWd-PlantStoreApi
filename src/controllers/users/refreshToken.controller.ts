import { ApiError } from "../../utils/ApiError";
import { asyncHandler } from "../../utils/asyncHandler";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../../models/userModel/user.model";

dotenv.config();

export const refreshAccessToken = asyncHandler(async(req, res)=>{
    // getting refresh token
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request")
    }

      // Ensure the secret key is available
   const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
   if (!refreshTokenSecret) {
     throw new ApiError(500, "Access token secret not configured");
   }
// token decode
   let decodedToken;

   try {
    decodedToken = jwt.verify(incomingRefreshToken, refreshTokenSecret)
   } catch (error) {
    throw new ApiError(401, "error while docede token");
   }
   // finding user from token 
   const user = await User.findById((decodedToken as any)?._id)
   // checking user 
   if(!user){
      throw new ApiError(401, "Invalid refresh token")  
   }
   // matching existing and user token
   if(incomingRefreshToken !== user?.refreshToken){
    throw new ApiError(401, "Refresh Token is expired or used")
   }

   

})