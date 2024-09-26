import mongoose, { Schema } from "mongoose";
import { Iproduct } from "../../types/productTypes";

const productSchema: Schema<Iproduct> = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      index: true,
    },
    description: {
      type: String,
      required: [true, "name is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "product category is required"]
    },
    size: {
      type: String,
      enum: ["S", "M", "L", "XL", "medium"],
      default: "medium",
    },
    price: {
      type: Number,
      required: [true, "number is required"],
    },
    stock: {
      type: Number,
      default : 0,
    },
    isActive: {
      type: Boolean,
      enum: ["true", "false"],
      default: true,
    },
    photo: {
      type: String,
      required: [true, "product photo is required"],
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model<Iproduct>("Product", productSchema);
