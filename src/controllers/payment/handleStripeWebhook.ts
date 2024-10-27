import { stripe } from "../../config/stripeConfig";
import { Order } from "../../models/orderModel/order.model";
import { asyncHandler } from "../../utils/asyncHandler";

// Webhook secret 
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const handleStripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    // verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      endpointSecret as string
    );
  } catch (err: any) {
    console.error("webhook signature verification failed");
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successfull payment Intent
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    // find and update order after payment confirmation
    const order = await Order.findById(orderId);
    if (order) {
      // Save the payment Intent ID to the payment field
      (order as any).payment = paymentIntent.id;
      order.orderStatus = "PAID";
      await order.save();
    }
  }

  res.status(200).send({ received: true });
});
