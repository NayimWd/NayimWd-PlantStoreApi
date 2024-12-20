import { Category } from "../../models/productModel/category.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

// create category
export const category = asyncHandler(async (req, res) => {
  // get category name from req.body
  const { name } = req.body;

  // Check if category already exists
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    throw new ApiError(400, "Category already exists");
  }

  // create new category
  const postCategory = await Category.create({ name });

  // validate category creation
  if (!postCategory) {
    throw new ApiError(500, "Category creation failed!");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, postCategory, "Category created successfully"));
});

// get all cetegory
export const getCategory = asyncHandler(async (req, res) => {

  // get categoris
  const categories = await Category.find();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        categoryLength: categories.length,
        category: categories,
      },
      "Category found successfully"
    )
  );
});

// delete category
export const deleteCategory = asyncHandler(async(req, res)=>{
  // get category id
  const {categoryId} = req.params;

  if(!categoryId){
    throw new ApiError(400, "category ID not found");
  }
  // delete category
  const deleteCategory = await Category.findByIdAndDelete(categoryId);

  if(!deleteCategory){
    throw new ApiError(400, "Something went wrong deleting category")
  }

})
