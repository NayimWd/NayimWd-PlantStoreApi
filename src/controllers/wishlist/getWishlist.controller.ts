import { Wishlist } from "../../models/wishlistModel/wishlist.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const getWisht_Item = asyncHandler(async (req, res) => {
  const userId = (req as any).user._id;

  if (!userId) {
    throw new ApiError(400, "Invalid token, User not found");
  }

  // get wishlist
  const wishlist = await Wishlist.find({ listedBy: userId }).populate({
    path: "wishlistItems.productId",
    select: "title price stock photo"
  })

  if (!wishlist || wishlist.length === 0) {
    throw new ApiError(404, "You have not added any product to wishlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, wishlist, "Wishlist fetched successfully"));
});
