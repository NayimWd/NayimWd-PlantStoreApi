import path from "path";
import { Cart } from "../../models/cartModel/cart.model";
import { ApiError } from "../../utils/ApiError";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";

export const getUserCart = asyncHandler(async (req, res) => {
  // get user id from token
  const userId = (req as any).user._id;

  // validate
  if (!userId) {
    throw new ApiError(400, "Invalid token, user not found");
  }

  // get user cart and populate cart item with product info
  const cart = await Cart.findOne({ addedBy: userId }).populate({
    path: "cartItems",
    populate: {
      path: "productId",
      select: "title price stock photo",
    },
  });

  if (!cart) {
    throw new ApiError(404, "No cart found for this user");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      cart,
      "Cart Item Found Successfully"
    )
  );
});
