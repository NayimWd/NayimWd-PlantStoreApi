import mongoose from "mongoose";
import { Wishlist } from "../../models/wishlistModel/wishlist.model";
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
 // get user wishlist
  let wishlist = await Wishlist.findOne({ listedBy: userId });
  
  // check user elready have a wishlist
  if (!wishlist) {
    // if not exists create new
    wishlist = await Wishlist.create({
      listedBy: userId,
      wishlistItems: [{ productId }],
    });
  } else {
    // if already exist
    const isProductInWishlist = wishlist.wishlistItems.some(
      (item: any) => item.productId.toString() === productId
    );

    if (isProductInWishlist) {
      throw new ApiError(400, "Product already exist in wishlist");
    }
    

    // add the product to wishlist
    wishlist.wishlistItems.push({productId})
    // save to db
    await wishlist.save();
  }

 return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        wishlist,
        "Product added to wishlist"
      )
    )
});
