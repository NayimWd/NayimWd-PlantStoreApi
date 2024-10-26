import { Order } from "../../models/orderModel/order.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const getAllOrders = asyncHandler(async(req, res)=>{
    const userId = (req as any).user._id;

    const isAdmin = (req as any).user.role === "admin";

    let orders;

    // get order for admin and specific user
    if(isAdmin){
        // fetch all orders
        orders = await Order.find().populate("orderedBy", "name email")
    } else {
        // users can get their own order
        orders = await Order.find({orderedBy: userId}).populate("orderedBy", "name email")
    }

    // validate orders
    if(!orders || orders.length === 0){
        throw new ApiError(404, "No order found")
    }

    return res
              .status(200)
              .json(
                new ApiResponse(
                    200,
                    orders,
                    "Order fetched successfully"
                )
              )
})