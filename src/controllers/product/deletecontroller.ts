import { Product } from "../../models/productModel/product.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const deleteProduct = asyncHandler(async(req, res)=>{
    const {pid} = req.params;

    if(!pid){
        throw new ApiError(400, "Product Id not found")
    }

   const deleteProduct = await Product.findByIdAndDelete(pid);

    if(!deleteProduct){
        throw new ApiError(400, "Product delete failed!")
    }

    return res.status(200)
              .json(
                new ApiResponse(
                    200, 
                    {},
                    "Product deleted success"
                )
              )

})