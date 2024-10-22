import { Cart } from "../../models/cartModel/cart.model";
import { CartItem } from "../../models/cartModel/cart_item.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const deleteCartItem = asyncHandler(async (req, res) => {
  // get user id from token
  const userId = (req as any).user._id;
  if (!userId) {
    throw new ApiError(400, "Invalid Token, no user found");
  }

  // get product Id from req body
  const { productId } = req.body;
  if (!productId) {
    throw new ApiError(400, "Product Id is required");
  }

  // find users cart
  const cart = await Cart.findOne({ addedBy: userId }).populate("cartItems");
  if (!cart) {
    throw new ApiError(404, "cart not found");
  }

  // get product id from cart and find cart item using that id
  const cartItem: any = cart.cartItems.find(
    (item: any) => item.productId.toString() === productId
  );
  // validate
  if (!cartItem) {
    throw new ApiError(404, "Product not found in the cart");
  }

  // remove cart item
  (cart as any).cartItems = cart.cartItems.filter(
    (item: any) => item.productId.toString() !== productId
  );

  // update total price and number of item
  cart.totalPrice -= cartItem.totalPrice;
  cart.numberOfItem -= cartItem.quantity;

  // remove cart item from any
  await CartItem.findByIdAndDelete(cartItem._id);

  // save updated cart
  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart Item removed successfully"));
});
