import { User } from "../../models/userModel/user.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const updateAccountDetails = asyncHandler(async(req, res)=>{
    const {name, phoneNumber} = req.body;
    // validate data
    if(!name || !phoneNumber){
        throw new ApiError(400, "All Fields are required")
    }
    // finding user
    const user = await User.findByIdAndUpdate(
        (req as any).user?._id,
        {
            $set: {
                name,
                phoneNumber
            }
        },
        {new: true}
    ).select("-password");

    return res
           .status(200)
           .json(
            new ApiResponse(
                200,
                user,
                "Account details Updated Successfully"
            )
           )

})