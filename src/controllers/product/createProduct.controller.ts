import { Category } from "../../models/productModel/category.model";
import { Product } from "../../models/productModel/product.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { uploadOnCloudinary } from "../../utils/cloudinary";


export const createProduct = asyncHandler(async (req, res) => {
  // getting product date
  const { title, description, category, size, price, stock, isActive } =
    req.body;
    // if(!title || !description || !category || !size || !price || !stock){
        
    // }

  // converting number and boolean type
  const productPrice = Number(price);
  const Productstock = Number(stock);

  // Check if the category exists
  const existingCategory = await Category.findOne({ name: category });
  if (!existingCategory) {
    throw new ApiError(404, "Category not found");
  }

  // getting product photo
  const photoLocalPath = req.file?.path; // Correcting how we access the file

  if (!photoLocalPath) {
    throw new ApiError(400, "Product Photo is required");
  }

  // uploading on cloudinary
  const productPhoto = await uploadOnCloudinary(photoLocalPath);

  // validate photo upload
  if (!productPhoto) {
    throw new ApiError(400, "Product photo upload failed");
  }
  // create new product
  const product = await Product.create({
    title,
    description,
    category: existingCategory._id,
    size,
    price: productPrice,
    stock: Productstock,
    isActive: isActive === "true",
    photo: productPhoto.url,
  });
  // validate product creation
  if (!product) {
    throw new ApiError(500, "Product creation failed");
  }


  // returning response
  return res
    .status(201)
    .json(new ApiResponse(
      201, product, "Product successfully created"));
});
