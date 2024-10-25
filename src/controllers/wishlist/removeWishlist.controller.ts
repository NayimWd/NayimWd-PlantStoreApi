import mongoose from "mongoose";
import { Wishlist } from "../../models/wishlistModel/wishlistItem.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const removeWishlist_Item = asyncHandler(async (req, res) => {
    const userId = (req as any).user._id;
  
    // Validate user ID
    if (!userId) {
      throw new ApiError(400, "Invalid Token, user not found");
    }
  
    // Get wishlist item ID from req.params (or req.body)
    const { wishlistItemId } = req.params; // assuming you're using a param
  
    // Validate wishlist item ID
    if (!wishlistItemId) {
      throw new ApiError(400, "Wishlist item ID is required");
    }
  
    // Find the wishlist item by ID
    const wishListItem = await Wishlist.findOne({
      _id: wishlistItemId,
      listedBy: userId, // Ensure the item belongs to the user
    });
  
    // Validate if the wishlist item exists
    if (!wishListItem) {
      throw new ApiError(404, "Wishlist item not found");
    }
  
    // Remove the wishlist item
    await Wishlist.findByIdAndDelete(wishListItem._id);
  
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Product removed from wishlist successfully"));
  });
