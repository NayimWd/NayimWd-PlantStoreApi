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
      required: [true, "product category is required"],
      index: true
    },
    size: {
      type: String,
      enum: ["S", "M", "L", "XL", "standard"],
      default: "standard",
      index: true
    },
    price: {
      type: Number,
      required: [true, "number is required"],
      index: true
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
