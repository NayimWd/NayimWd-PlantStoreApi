import { Category } from "../../models/productModel/category.model";
import { Product } from "../../models/productModel/product.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const getSingleProduct = asyncHandler(async (req, res) => {
  const productId = req.params.pid;

  const searchProduct = await Product.findById(productId);

  if (!searchProduct) {
    throw new ApiError(404, "Product does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, searchProduct, "Product found successfully"));
});

export const getAllProducts = asyncHandler(async (req, res) => {
  // getting all queries
  const {
    page = 1,
    limit = 10,
    size,
    minPrice,
    maxPrice,
    title,
    category,
    sortOrder = "desc",
  } = req.query;

  // pagination
  const pageNumber = Number(page);
  const pageSize = Number(limit);
  const skip = (pageNumber - 1) * pageSize;

  // filter condition
  const matchConditions: any = {};

  // size filter
  if (size) {
    matchConditions.size = size;
  }

  // price filter
  if (maxPrice || minPrice) {
    matchConditions.price = {};
    if (minPrice) matchConditions.price.$gte = Number(minPrice);
    if (maxPrice) matchConditions.price.$lte = Number(maxPrice);
  }

  // title filter
  if (title) {
    matchConditions.title = { $regex: title, $options: "i" }; // case insensitive
  }

  // category search
  if (category) {
    // get category objectedId based on name
    const categoryId = await Category.findOne({ name: category });
    if (!categoryId) {
      throw new ApiError(404, "product category do not exist");
    }
    matchConditions.category = categoryId._id;
  }

  // Aggregation pipeline stages
  const productsPipeline: any[] = [{ $match: matchConditions }];

  // Pagination
  productsPipeline.push({ $skip: skip });
  productsPipeline.push({ $limit: pageSize });

  // Lookup for category details
  productsPipeline.push({
    $lookup: {
      from: "categories", // The name of the collection in MongoDB
      localField: "category",
      foreignField: "_id",
      as: "categoryDetails",
    },
  });

  // Unwind the categoryDetails array to make it a flat structure
  // Unwind the categoryDetails array to make it a flat structure
  productsPipeline.push({
    $unwind: {
      path: "$categoryDetails",
      preserveNullAndEmptyArrays: true, // Prevents errors if categoryDetails is empty
    },
  });

  // Sort by creation date
  const sortDirection = sortOrder === "asc" ? 1 : -1; // Determine sort order
  productsPipeline.push({ $sort: { createdAt: sortDirection } }); // Use determined sort order

  const products = await Product.aggregate(productsPipeline);

  if (!products.length) {
    throw new ApiError(404, "Product do not exist for this filter!");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        productsLength: products.length,
        products,
      },
      "Products found successfully"
    )
  );
});
