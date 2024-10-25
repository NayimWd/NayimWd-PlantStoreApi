import { Wishlist } from "../../models/wishlistModel/wishlist.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const removeWishlist_Item = asyncHandler(async (req, res) => {
    const userId = (req as any).user._id;
  
    // Validate user ID
    if (!userId) {
      throw new ApiError(400, "Invalid Token, user not found");
    }
  
    // getting product id from request body
    const {productId} = req.body;

    if(!productId){
      throw new ApiError(400, "Product Id required")
    };

    // find user's wishlist
    const wishList = await Wishlist.findOne({listedBy: userId})
    // if wishlist do not exist
    if(!wishList){
      throw new ApiError(404, "Wishlist not found")
    }

    // if product already exist in wishlist
    const itemIndex = wishList.wishlistItems.findIndex(
      (item: any) => item.productId.toString() === productId,
    )

    if(itemIndex === -1){
      throw new ApiError(404, "Product is not found in wishlist")
    }

     // Remove the item from the wishlist
     wishList.wishlistItems.splice(itemIndex, 1);
     await wishList.save();

     return res
            .status(200)
            .json(
              new ApiResponse(
                200,
                wishList,
                "Product removed from wishlist successfully"
              )
            )
  });
