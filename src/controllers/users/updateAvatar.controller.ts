import { Request, Response } from "express";
import { User } from "../../models/userModel/user.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { uploadOnCloudinary } from "../../utils/cloudinary";

export const updateAvatar = asyncHandler(async(req: Request, res: Response)=>{
    // getting file
    const avatarLocalPath = req.file?.path;
   
    // validating file
    if(!avatarLocalPath){
        new ApiError(
            400,
            "Avatar file is missing"
        )
    }

    // uploading on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    // validating cloudinary url
    if(!avatar?.url){
        throw new ApiError(400, "Error while updating avatar")
    }

    await User.findByIdAndUpdate(
        (req as any).user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res
           .status(200)
           .json(
            new ApiResponse(
                200,
                {},
                "Avatar Updated successfully"
            )
           )

})