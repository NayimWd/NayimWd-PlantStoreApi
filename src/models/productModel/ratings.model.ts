import mongoose, { Schema } from "mongoose";
import { IReview } from "../../types/productTypes";

const reviewSchema: Schema<IReview> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "product is required"],
    },
    rating: {
      type: Number,
      default: 0,
    },
    numberOfRatings: {
      type: Number,
      required: [true, "total rating required"],
    },
    averageRating: {
      type: Number,
      required: [true, "average rating is required"],
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);
