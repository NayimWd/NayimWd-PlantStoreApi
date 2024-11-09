import { Order } from "../../models/orderModel/order.model";
import { Product } from "../../models/productModel/product.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { invalidateCache } from "../../utils/cacheUtils";

export const cancelOrder = asyncHandler(async (req, res) => {
  // get user and admin
  const userId = (req as any).user._id;
  const admin = (req as any).role === "admin";
  // validate
  if (!userId) {
    throw new ApiError(400, "Invalid token, User not found");
  }

  // get order id from req params
  const { orderId } = req.params;

  // find order by order id
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // check for user placed the order or an admin
  if (order.orderedBy.toString() !== userId.toString() && admin) {
    throw new ApiError(403, "Unauthorized access");
  }

  // check if order already canceled or completed
  if (order.orderStatus === "CANCELLED" || order.orderStatus === "PAID") {
    throw new ApiError(400, "Can not cancel or delete this order (C/D)");
  }

  // update order status to cancelled
  order.orderStatus = "CANCELLED";
  await order.save();

  // after order cancel increase that stock to product stock
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: item.qty },
    });
  }

   // Clear the Redis cache after cancel order (get all products query)
   await invalidateCache("products:*")

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order cancelled successfully"));
});
