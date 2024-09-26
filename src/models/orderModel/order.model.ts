import mongoose, { Schema } from "mongoose";
import { IOrder, IOrderItem } from "../../types/productTypes";

// order item
const orderItemSchema: Schema<IOrderItem> = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product Id is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  qty: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: [true, "Total Price is required"],
  },
});

// order
const OrderSchema: Schema<IOrder> = new Schema(
  {
    orderdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    orderItems: [orderItemSchema],
    subTotal: {
      type: Number,
      required: [true, "subtotal is required"],
    },
    shippingCharge: {
      type: Number,
      default: 50,
    },
    total: {
      type: Number,
      required: [true, "Total Price is required"],
    },
    shippingInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShippingInfo",
      required: [true, "shipping info required"],
    },
    OrderStatus: {
      type: String,
      enum: ["PENDING", "PROCESSING", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
