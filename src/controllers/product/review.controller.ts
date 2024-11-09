import mongoose from "mongoose";
import { Review } from "../../models/productModel/ratings.model";
import { User } from "../../models/userModel/user.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import redis from "../../config/redisClient";
import { invalidateCache } from "../../utils/cacheUtils";

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

  if(!newReview){
    throw new ApiError(400, "something went wrong creating review");
  };

  // Clear the Redis cache for this product review after the update
  await invalidateCache('reviews', pid)
  // Clear the Redis cache for all this products review (get all products query)
  await invalidateCache("reviews:*")

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

  // Construct the cache key for the single product review
  const cacheKey = `reviews:${pid}`;
  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData)); // Return cached data if available
    }
  } catch (error) {
    console.error('Error fetching from Redis:', error);
    // Fallback to MongoDB query in case of Redis error
  }


  // getting reviews useing Aggregation pipeline
  const reviews = await Review.aggregate([
    // 1st pipeline - matching product Id
    {
      $match: { productId: new mongoose.Types.ObjectId(pid) },
    },
    // 2nd pipeline - getting user name by ratingBy field of reviews
    {
      $lookup: {
        from: "users", // refering to User schema
        localField: "ratingBy",
        foreignField: "_id",
        as: "userDetails", // store user details as user
      },
    },
    // 3rd pipeline - spread userDetails array
    {
      $unwind: "$userDetails",
    },
    // 4th pipeline - group these
    {
      $group: {
        _id: "$productId",
        reviews: {
          $push: {
            _id: "$_id",
            rating: "$rating", // store in rating field
            comment: "$comment", // user comment
            userName: "$userDetails.name", // name of reviewer that got from 2 nd pipeline
          },
        },
        // get total rating and number of ratings
        totalRating: { $sum: "$rating" },
        numberOrReviews: { $sum: 1 },
      },
    },
    // 5th - project data
    {
      $project: {
        _id: 1,
        reviews: 1,
        // calculating average ratings
        averageRating: {
          $cond: {
            if: { $eq: ["$numberOrReviews", 0] },
            then: 0,
            else: { $divide: ["$totalRating", "$numberOrReviews"] },
          },
        },
        numberOfReviews: 1,
      },
    },
  ]);

  if (!reviews.length) {
    throw new ApiError(404, "No reviews found for this product");
  }

  // chache review data
  await redis.set(cacheKey, JSON.stringify(reviews)); // Cache for 1 hour (3600 seconds)

  return res
    .status(200)
    .json(new ApiResponse(200, reviews, "All review fetched success"));
});

// review update
export const updateReview = asyncHandler(async (req, res) => {
  // get product and review id
  const { pid, reviewId } = req.params;
  // validate
  if (!pid) {
    throw new ApiError(400, "Product Id required");
  }

  // validate
  if (!reviewId) {
    throw new ApiError(400, "Review Id required");
  }

  // get user Id
  const userId = (req as any).user._id;
  // validate
  if (!userId) {
    throw new ApiError(400, "Invalid token, User Not found");
  }

  // check user already reviewd
  const existingReview = await Review.findOne({
    _id: reviewId,
    productId: pid,
    ratingBy: userId,
  });

  if (!existingReview) {
    throw new ApiError(
      404,
      "Review not found or user is not authorized to update this review"
    );
  }

  // get data to update
  const { rating, comment } = req.body;

  const updateData: any = {};

  // check user posted update data or not
  if (rating !== undefined) updateData.rating = rating;
  if (comment !== undefined) updateData.comment = comment;

  // update the review
  const updateReview = await Review.findOneAndUpdate(
    {
      _id: reviewId,
      productId: pid,
      ratingBy: userId,
    },
    {
      $set: updateData,
    },
    { new: true, runValidators: true }
  );

  // validate
  if (!updateReview) {
    throw new ApiError(400, "Failed to update review");
  }

  // Clear the Redis cache for this product review after the update
  await invalidateCache('reviews', pid)
  // Clear the Redis cache for all this products review (get all products query)
  await invalidateCache("reviews:*")

  return res
    .status(200)
    .json(new ApiResponse(200, updateReview, "Review update successful"));
});

// delete review
// delete review
export const deleteProduct_Reviews = asyncHandler(async (req, res) => {
  // get product and review id
  const { pid, reviewId } = req.params;

  if (!pid || !reviewId) {
    throw new ApiError(400, "Product and Review Id required");
  }

  // getting user id and role
  const userId = (req as any).user?._id;
  const userRole = (req as any).user?.role;

  // find review
  const review = await Review.findOne({ _id: reviewId, productId: pid });

  if (!review) {
    throw new ApiError(404, "Product review not found");
  }
 

  // validate that either the user posted the review or the user is an admin
  if (review.ratingBy.toString() !== userId.toString() && userRole !== "admin") {
    throw new ApiError(403, "You are not authorized to delete this review");
  }

  // delete review
  const deleteReview = await Review.findByIdAndDelete(reviewId);

  if(!deleteReview){
    throw new ApiError(400, "Error on deleting review")
  }

  // Clear the Redis cache for this product review after the update
  await invalidateCache('reviews', pid)
  // Clear the Redis cache for all this products review (get all products query)
  await invalidateCache("reviews:*")

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Review deleted successfully"));
});
