import mongoose, { Schema } from "mongoose";
import { IOrder, IOrderItem } from "../../types/productTypes";

// order item
// Order Item Schema
const orderItemSchema: Schema<IOrderItem> = new Schema(
  {
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
  },
  { timestamps: true }
);

// Order Schema
const OrderSchema: Schema<IOrder> = new Schema(
  {
    orderedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    orderItems: [orderItemSchema],
    subTotal: {
      type: Number,
      required: [true, "Subtotal is required"],
    },
    shippingCharge: {
      type: Number,
      default: 50,
    },
    total: {
      type: Number,
      required: [true, "Total Price is required"],
    },
    payment: {
      type: mongoose.Schema.Types.Mixed,
      ref: "Payment",
      default: null
    },
    city: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    shippingAddress: {
      type: String,
      required: [true, "Shipping address is required"],
    },
    orderStatus: {
      type: String,
      enum: ["PENDING", "PROCESSING", "PAID", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ["PENDING", "PROCESSING", "DELIVERED", "CANCELLED"],
          default: "PENDING"
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
