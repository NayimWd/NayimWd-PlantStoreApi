import mongoose, { Schema } from "mongoose";
import { IProductCategory } from "../../types/productTypes";

const productCategorySchema: Schema<IProductCategory> = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product Id is required"],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

export const ProductCategory = mongoose.model<IProductCategory>(
  "ProductCategory",
  productCategorySchema
);
