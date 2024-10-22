import { Cart } from "../../models/cartModel/cart.model";
import { CartItem } from "../../models/cartModel/cart_item.model";
import { Product } from "../../models/productModel/product.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const updateCart = asyncHandler(async (req, res) => {
    // get user id form token 
    const userId = (req as any).user._id;
  
    if (!userId) {
      throw new ApiError(400, "Invalid Token, user not found");
    }
  
    // get product id and product quantity from req body
    const { productId, newQty } = req.body;
  
    if (!productId || !newQty || newQty < 0) {
      throw new ApiError(400, "Product id and valid new quantity are required");
    }
  
    // get product by product id
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }
  
    // check product stock
    if (newQty > product.stock) {
      throw new ApiError(400, "Insufficient stock");
    }
  
    // find user's cart and populate the cart items to get product details
    const cart: any = await Cart.findOne({ addedBy: userId }).populate('cartItems');
    if (!cart) {
      throw new ApiError(400, "Cart not found");
    }
  
    // find the cart item that matches the productId
    const cartItem = cart.cartItems.find(
      (item: any) => item.productId.toString() === productId
    );
  
    if (!cartItem) {
      throw new ApiError(404, "Cart item not found");
    }
  
    // if new quantity is zero, remove that from cart
    if (newQty === 0) {
      cart.cartItems = cart.cartItems.filter(
        (item: any) => item.productId.toString() !== productId
      );
      cart.numberOfItem -= cartItem.quantity;
      cart.totalPrice -= cartItem.totalPrice;
  
      // remove the cart item from the database
      await CartItem.findByIdAndDelete(cartItem._id);
    } else {
      // update cart item quantity and total price
      // update cart item quantity and total price
    const priceDifference = (newQty - cartItem.quantity) * product.price;

    cartItem.quantity = newQty;
    cartItem.totalPrice = cartItem.quantity * product.price;

    // update the total price in the cart
    cart.totalPrice += priceDifference;

    // save the updated cart item
    await cartItem.save();
    }
  
     // recalculate total number of items in the cart
  cart.numberOfItem = cart.cartItems.reduce((total: number, item: any) => total + item.quantity, 0);

    // save the updated cart
    await cart.save();
  
    return res
      .status(200)
      .json(new ApiResponse(200, cart, "Cart updated successfully"));
  });