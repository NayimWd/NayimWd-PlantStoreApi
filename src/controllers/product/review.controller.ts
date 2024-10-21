import mongoose from "mongoose";
import { Review } from "../../models/productModel/ratings.model";
import { User } from "../../models/userModel/user.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const createRatings = asyncHandler(async (req, res) => {
  // get current user
  const userId = (req as any).user._id;

  // validate user
  if (!userId) {
    throw new ApiError(404, "Invalid token, user not found");
  }
  // geting product Id
  const { pid } = req.params;
  // validate product id
  if (!pid) {
    throw new ApiError(404, "Product Id required");
  }

  // getting rating as number and review as comment
  const { rating, comment } = req.body;

  // check rating exist by specefic user
  const existingReview = await Review.findOne({
    productId: pid,
    ratingBy: userId,
  });

  if (existingReview) {
    throw new ApiError(400, "You have already reviewed this product");
  }

  // create new review
  const newReview = await Review.create({
    productId: pid,
    ratingBy: userId,
    rating,
    comment,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, newReview, "product review created successfully")
    );
});

export const getAllReviewsOfProduct = asyncHandler(async (req, res) => {
  // getting product id for searching all reviews
  const { pid } = req.params;

  // validate product id
  if (!pid) {
    throw new ApiError(400, "Product id required");
  }

  // getting reviews
  const reviews = await Review.aggregate([
    {
      $match: { productId: new mongoose.Types.ObjectId(pid) },
    },
    {
      $lookup: {
        from: "users", // The name of the User collection
        localField: "ratingBy",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: "$userDetails", // Flatten the user details array
    },
    {
      $group: {
        _id: "$productId",
        reviews: {
          $push: {
            rating: "$rating",
            comment: "$comment",
            userName: "$userDetails.name",
          },
        },
        totalRating: { $sum: "$rating" },
        numberOfReviews: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        reviews: 1,
        averageRating: {
          $cond: {
            if: { $eq: ["$numberOfReviews", 0] },
            then: 0,
            else: { $divide: ["$totalRating", "$numberOfReviews"] },
          },
        },
        numberOfReviews: 1,
      },
    },
  ]);

  if (!reviews.length) {
    throw new ApiError(404, "No reviews found for this product");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, reviews, "All review fetched success"));
});
