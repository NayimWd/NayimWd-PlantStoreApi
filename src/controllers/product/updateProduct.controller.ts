import { Category } from "../../models/productModel/category.model";
import { Product } from "../../models/productModel/product.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { uploadOnCloudinary } from "../../utils/cloudinary";

export const updateProductsDetails = asyncHandler(async (req, res) => {
  // getting product id to update
  const { pid } = req.params;

  // validate id
  if (!pid) {
    throw new ApiError(400, "Product Id required");
  }

  // get details for update
  const { title, description, category, size, price, stock, isActive } = req.body;

  // If category is provided, find the category ObjectId by name
  let categoryId;
  if (category) {
    const foundCategory = await Category.findOne({ name: category });
    if (!foundCategory) {
      throw new ApiError(404, "Product category does not exist");
    }
    categoryId = foundCategory._id;
  }

  // update operation
  const updateProduct = await Product.findByIdAndUpdate(
    pid,
    {
      $set: {
        title,
        description,
        category: categoryId, // use the found categoryId if category was provided
        size,
        price,
        stock,
        isActive,
      },
    },
    { new: true, runValidators: true }
  );

  if (!updateProduct) {
    throw new ApiError(400, "Product update failed");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updateProduct, "Product updated successfully"));
});

// =================== update photo ===================== //
export const updateProductPhoto = asyncHandler(async (req, res) => {
  // get product Id
  const { pid } = req.params;
  // get local path
  const photoLocalPath = req.file?.path;

  // validate local path
  if (!photoLocalPath) {
    throw new ApiError(400, "Product Photo is missing");
  }

  // upload photo on cloudinary
  const productPhoto = await uploadOnCloudinary(photoLocalPath);

  // update photo
  const updatePhoto = await Product.findByIdAndUpdate(
    pid,
    {
      $set: {
        photo: productPhoto?.url,
      },
    },
    { new: true, runValidators: true }
  );
  // validate photo
  if (!updatePhoto) {
    throw new ApiError(400, "Photo update failed!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "photo updated successfully"));
});
