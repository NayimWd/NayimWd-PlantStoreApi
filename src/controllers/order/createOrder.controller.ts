import { Cart } from "../../models/cartModel/cart.model";
import { Order } from "../../models/orderModel/order.model";
import { Product } from "../../models/productModel/product.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const createOrderFromCart = asyncHandler(async (req, res) => {
  // get user
  const userId = (req as any).user._id;
  if (!userId) {
    throw new ApiError(400, "Invalid token, user not found");
  }

  // getting address, shipping charge and paymentmethod
  const { shippingAddress, paymentMethod } = req.body;

  if (!shippingAddress || !paymentMethod) {
    throw new ApiError(400, "Shipping Address and Payment method required");
  }

  // get cart for the user
  const cart = await Cart.findOne({ addedBy: userId }).populate(
    "cartItems.productId"
  );
  if (!cart || cart.cartItems.length < 1) {
    throw new ApiError(404, "No Item in cart to place an order");
  }

  // initialize order
  const orderItems = [];
  let subTotal = 0;

  // update stock and calculate total
  for (const item of cart.cartItems) {
    const product = await Product.findById((item as any).productId);

    if (!product) {
      throw new ApiError(404, "product not found for this id");
    }

    // check stock
    if (product.stock < (item as any).quantity) {
      throw new ApiError(400, "Insufficient stock");
    }

    // add to order item
    orderItems.push({
      productId: product._id,
      price: product.price,
      qty: (item as any).quantity,
      totalPrice: product.price * (item as any).quantity,
    });

    // calculate subtotal
    subTotal += product.price * (item as any).quantity;
  }

  // add shopping charge
  const shippingCharge = 50;
  const total = subTotal + shippingCharge;

  // create order
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

  // update product stock after order placement
  for (const item of cart.cartItems) {
    await Product.findByIdAndUpdate((item as any).productId, {
      $inc: {
        stock: -(item as any).quantity,
      },
    });
  }


  // Clear cart after order placement
  await Cart.findOneAndDelete({ addedBy: userId });

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order placed successfully"));
});
