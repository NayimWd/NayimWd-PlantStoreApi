import mongoose, { Schema } from "mongoose";
import { IPayment } from "../../types/productTypes";

const paymentSchema: Schema<IPayment> = new Schema(
  {
    price: {
      type: Number,
      required: [true, "Payment is required"],
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    paymentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
