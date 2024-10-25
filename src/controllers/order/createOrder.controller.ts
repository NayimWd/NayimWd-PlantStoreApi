import { model } from "mongoose";
import { Cart } from "../../models/cartModel/cart.model";
import { Order } from "../../models/orderModel/order.model";
import { Product } from "../../models/productModel/product.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const createOrderFromCart = asyncHandler(async (req, res) => {
  const userId = (req as any).user._id;
  if (!userId) {
    throw new ApiError(400, "Invalid token, user not found");
  }

  const { shippingAddress, paymentMethod } = req.body;
  if (!shippingAddress || !paymentMethod) {
    throw new ApiError(400, "Shipping Address and Payment method required");
  }

  const cart = await Cart.findOne({ addedBy: userId }).populate({
    path: "cartItems", // populate cart item
    populate: {
      path: "productId", // populate product Id with each cart item
      model: "Product", // from product schema
    },
  });
  if (!cart || cart.cartItems.length < 1) {
    throw new ApiError(404, "No Item in cart to place an order");
  }

  const orderItems = [];
  let subTotal = 0;

  for (const item of cart.cartItems) {
    const product = (item as any).productId;

    if (!product) {
      throw new ApiError(
        404,
        `Product not found for ID: ${(item as any).productId._id.toString()}`
      );
    }

    if (product.stock < (item as any).quantity) {
      throw new ApiError(
        400,
        `Insufficient stock for product: ${product.title}`
      );
    }

    orderItems.push({
      productId: product._id,
      price: product.price,
      qty: (item as any).quantity,
      totalPrice: product.price * (item as any).quantity,
    });

    subTotal += product.price * (item as any).quantity;
  }

  const shippingCharge = 50;
  const total = subTotal + shippingCharge;

  const order = await Order.create({
    orderedBy: userId,
    orderItems: orderItems,
    subTotal: subTotal,
    shippingCharge: shippingCharge,
    total: total,
    shippingAddress: shippingAddress,
    orderStatus: "PENDING",
    payment: paymentMethod === "COD" ? "pending" : null,
  });

  for (const item of cart.cartItems) {
    await Product.findByIdAndUpdate((item as any).productId, {
      $inc: { stock: -(item as any).quantity },
    });
  }

  await Cart.findOneAndDelete({ addedBy: userId });

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order placed successfully"));
});
