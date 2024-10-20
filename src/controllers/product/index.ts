import { category, getCategory } from "./createCategory.controller";
import { createProduct } from "./createProduct.controller";
import { getSingleProduct, getAllProducts } from "./getProducts.controller";
import { updateProductPhoto, updateProductsDetails } from "./updateProduct.controller";
import { deleteProduct } from "./deletecontroller";
import { createRatings } from "./review.controller";


export {
    category,
    getCategory,
    createProduct,
    getSingleProduct,
    getAllProducts,
    updateProductsDetails,
    updateProductPhoto,
    deleteProduct,
    createRatings
}