import { Wishlist } from "../../models/wishlistModel/wishlistItem.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const addToWishlist = asyncHandler(async (req, res) => {
  const userId = (req as any).user._id;

  // validate user id
  if (!userId) {
    throw new ApiError(400, "Invalid Token, User not found");
  }

  // get product id from req body
  const { productId } = req.body;
  if (!productId) {
    throw new ApiError(400, "Product not found");
  }

  // check user elready have a wishlist
  let existingWishList = await Wishlist.findOne({
    listedBy: userId,
    productId: productId,
  });

  // check product already added to wishlist
  if (existingWishList) {
    throw new ApiError(400, "This product is already exists in wishlist");
  }

  // create new wishlist
  const newWishlist = await Wishlist.create({
    listedBy: userId,
    productId: productId,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, newWishlist, "Product added to wishlist successfull")
    );
});
