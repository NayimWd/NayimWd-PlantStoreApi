import { Cart } from "../../models/cartModel/cart.model";
import { Order } from "../../models/orderModel/order.model";
import { Product } from "../../models/productModel/product.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { Wishlist } from "../../models/wishlistModel/wishlist.model";
import { stripe } from "../../config/stripeConfig";

export const createOrderFromCart = asyncHandler(async (req, res) => {
  const userId = (req as any).user._id;
  if (!userId) {
    throw new ApiError(400, "Invalid token, user not found");
  }

  const {city, zipCode, shippingAddress, paymentMethod } = req.body;
  if (!city || !zipCode || !shippingAddress || !paymentMethod) {
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

  // create new order for cash on delivery order
  const order = await Order.create({
    orderedBy: userId,
    orderItems: orderItems,
    subTotal: subTotal,
    shippingCharge: shippingCharge,
    total: total,
    city: city,
    zipCode: zipCode,
    shippingAddress: shippingAddress,
    orderStatus: "PENDING",
    payment: paymentMethod === "COD" ? "pending" : null,
  });

  // create new order for card payment order
  if (paymentMethod !== "COD") {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total * 100,
      currency: "usd",
      metadata: {
        orderId: order._id.toString(),
      },
    });

    return res  
            .status(200)
            .json({
              order,
              clientSecret : paymentIntent.client_secret,
              message: "Order created successfully with payment"
            })
  }

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

export const createOrderfromWishlist = asyncHandler(async (req, res) => {
  const userId = (req as any).user;
  if (!userId) {
    throw new ApiError(400, "Invalid token, User not found");
  }

  // get details from req body
  const {city, zipCode, shippingAddress, paymentMethod } = req.body;
 
  if (!city || !zipCode || !shippingAddress || !paymentMethod) {
    throw new ApiError(400, "Shipping Address and Payment method required");
  }

  // fetch users wishlist and populate product details
  const wishlist = await Wishlist.findOne({ listedBy: userId }).populate({
    path: "wishlistItems.productId",
    model: "Product",
  });

  if (!wishlist || wishlist.wishlistItems.length < 1) {
    throw new ApiError(404, "wishlist is empty");
  }

  // initialize variable for order item and subtotal
  const orderItems = [];
  let subTotal = 0;

  // place order
  for (const item of wishlist.wishlistItems) {
    const product = (item as any).productId;

    if (!product) {
      throw new ApiError(
        404,
        `product not found for this ID: ${(req as any).productId._id}`
      );
    }

    // check product stock
    if (product.stock < 1) {
      throw new ApiError(400, "Insufficient product stock");
    }

    // push data to orderItems variable
    orderItems.push({
      productId: product._id,
      price: product.price,
      qty: 1,
      totalPrice: product.price,
    });

    // subtotal
    subTotal += product.price;
  }

  // add shipping charge
  const shippingCharge = 50;
  const total = subTotal + shippingCharge;

  // create new order for cash on delivery
  const order = await Order.create({
    orderedBy: userId,
    orderItems: orderItems,
    subTotal,
    shippingCharge,
    total,
    city,
    zipCode,
    shippingAddress,
    orderStatus: "PENDING",
    payment: paymentMethod === "COD" ? "pending" : null,
  });

  //create new order for card payment order
  if (paymentMethod !== "COD") {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total * 100,
      currency: "usd",
      metadata: {
        orderId: order._id.toString(),
      },
    });

    return res
             .status(200)
             .json({
              order,
              clientSecret: paymentIntent.client_secret,
              message: "Order created successfully with payment"
             })
  }

  if (!order) {
    throw new ApiError(400, "Place order from wishlist failed");
  }

  // update product stock
  for (const item of wishlist.wishlistItems) {
    await Product.findByIdAndUpdate((item as any).productId, {
      $inc: { stock: -1 },
    });
  }

  // clear wishlist
  await Wishlist.findOneAndDelete({ listedBy: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order placed successfully"));
});
