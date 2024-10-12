import { string } from "zod";
import { User } from "../../models/userModel/user.model";
import { ApiError } from "../../utils/ApiError";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import { Request, Response } from "express";

export const changeCurrentPassword  = asyncHandler(async(req: Request, res: Response)=>{
    // getting password from req
    const {oldPassword, newPassword} = req.body;
    // getting existing password
    const user = await User.findById((req as any).user._id)

      // checking if user exists
  if (!user) {
    throw new ApiError(404, "User not found");
  }

    // validating password
   const isPassCorrect = await user.isPasswordCorrect(oldPassword);
    if(!isPassCorrect){
        throw new ApiError(400, "Invalid Old Password")
    }
    // seting new password
    user.password = newPassword
    await user?.save({validateBeforeSave: false})

    return res  
           .status(200)
           .json(
            new ApiResponse(
                200,
                {},
                "Password changed successfully"
            )
           )

})