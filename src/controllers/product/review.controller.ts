import { Review } from "../../models/productModel/ratings.model";
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
