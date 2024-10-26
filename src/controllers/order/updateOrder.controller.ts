import { Order } from "../../models/orderModel/order.model";
import { Product } from "../../models/productModel/product.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const orderUpdate = asyncHandler(async (req, res) => {
  // get user id and admin
  const userId = (req as any).user._id;
  const admin = (req as any).user.role === "admin";

  if (!userId) {
    throw new ApiError(400, "Invalid token, user not found");
  }

  // getting orderId
  const { orderId } = req.params;
  // get update item as an array, inside that it will be **-productId and newQuantity-**
  const { updatedItems } = req.body;

  // find the order
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(400, "Order not found");
  }

  // check user placed the order or an admin
  if (order.orderedBy.toString() !== userId.toString() && admin) {
    throw new ApiError(403, "Unauthorized access");
  }

  let subTotal = 0;

  // update orderItem if exists
  if (updatedItems && updatedItems.length > 0) {
    for (const item of updatedItems) {
      // find order item
      const orderItem = order.orderItems.find(
        (oitem: any) => oitem.productId.toString() === item.productId
      );
      // validate order item
      if (!orderItem) {
        throw new ApiError(400, "Invalid product id for update product");
      }

      // get product by productId
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new ApiError(404, "Product not found");
      }
      // check product stock
      if (product.stock < item.newQuantity) {
        throw new ApiError(400, "Insufficient product stock");
      }

      // update product qty of order
      orderItem.qty = item.newQuantity;
      // update subtotal calculation
      orderItem.totalPrice = product.price * item.newQuantity;
      subTotal += Number(orderItem.totalPrice);
    }

    // update subtotal
    order.subTotal = subTotal;
    // update total
    order.total = subTotal + order.shippingCharge;

    // save updated order
    await order.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order updated successfully"));
});
