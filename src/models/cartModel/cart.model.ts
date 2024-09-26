import mongoose, { Schema } from "mongoose";
import { ICart } from "../../types/productTypes";

const CartSchema: Schema<ICart> = new Schema(
  {
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    cartItems: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "CartItem",
      required: [true, "cart info is required"],
    },
    numberOfItem: {
      type: Number,
      required: [true, "qty is required"],
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Cart = mongoose.model<ICart>("Cart", CartSchema);
