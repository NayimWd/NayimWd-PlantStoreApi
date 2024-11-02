import { stripe } from "../../config/stripeConfig";
import { Order } from "../../models/orderModel/order.model";
import { ApiError } from "../../utils/ApiError";
import { asyncHandler } from "../../utils/asyncHandler";

export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
 
  if (!orderId) {
    throw new ApiError(400, "Order id is required");
  }

  // fetch order by orderId
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // check payment status
  if (order.payment?.toString() !== "pending") {
    throw new ApiError(400, "Order already paid or invalid payment status");
  }

  // create stripe payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: order.total * 100,
    currency: "usd",
    metadata: {
      orderId: order._id.toString(),
    },
  });

  return res.status(200).json({
    clientSecret: paymentIntent.client_secret,
  });
});
