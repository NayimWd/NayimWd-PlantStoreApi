import { Request, Response } from "express";
import { Cart } from "../../models/cartModel/cart.model";
import { CartItem } from "../../models/cartModel/cart_item.model";
import { Product } from "../../models/productModel/product.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  // Get user ID from token
  const userId = (req as any).user._id;

  // Get product ID and quantity from request body
  const { productId, quantity } = req.body;

  // Validate the product ID and quantity
  if (!productId || !quantity || quantity <= 0) {
    throw new ApiError(400, "Product ID and valid quantity are required");
  }

  // get the product from the database
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // check for stock availe or not
  if (product.stock < quantity) {
    throw new ApiError(400, `Only ${product.stock} items available in stock`);
  }

  // calculate total price
  const totalPrice = product.price * quantity;

  // check if user already has a cart
  let cart = await Cart.findOne({ addedBy: userId }).populate("cartItems");

  if (cart) {
    // check if the cart already contains the product
    const existingCartItem: any = cart.cartItems.find(
      (item: any) => item.productId.toString() === productId
    );

    if (existingCartItem) {
      // update the quantity and total price of the existing cart item
      existingCartItem.quantity += quantity;
      existingCartItem.totalPrice += totalPrice;
      await existingCartItem.save();
    } else {
      // create a new cart item and add to cart
      const cartItem = await CartItem.create({
        productId,
        price: product.price,
        quantity,
        totalPrice,
      });
      cart.cartItems.push(cartItem._id);
    }

    // update the cart's total items and price
    cart.numberOfItem += quantity;
    cart.totalPrice += totalPrice;
  } else {
    // create a new cart if the user does not have
    const cartItem = await CartItem.create({
      productId,
      price: product.price,
      quantity,
      totalPrice,
    });

    cart = await Cart.create({
      addedBy: userId,
      cartItems: [cartItem._id],
      numberOfItem: quantity,
      totalPrice,
    });
  }

  // save the updated cart
  await cart.save();

  return res
    .status(201)
    .json(new ApiResponse(201, cart, "Product added to cart successfully"));
});
