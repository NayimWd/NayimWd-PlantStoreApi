import { Router } from "express";
import {
  category,
  getCategory,
  deleteCategory,
  createProduct,
  createRatings,
  deleteProduct,
  deleteProduct_Reviews,
  getAllProducts,
  getAllReviewsOfProduct,
  getSingleProduct,
  updateProductPhoto,
  updateProductsDetails,
  updateReview,
} from "../controllers/product";
import { isAdmin, veryfyJWT } from "../middlewares/auth.middleware";
import zodValidator from "../middlewares/validator.middleware";
import { ZodcategorySchema } from "../validator";
import { ZodProductSchema } from "../validator/product_validator";
import { upload } from "../middlewares/multer.middleware";
import { cacheMiddleware } from "../middlewares/cacheMiddleware";



const router: Router = Router();

interface Iproduct {
  category: "/create_category";
  delete_category: "/delete_category";
  find_cetegory: "/category";
  create_product: "/create_product";
  getSingle_product: "/getSingle_Product/:pid";
  getAll_products: "/getAll_products";
  update_product_details: "/update_product_details/:pid";
  update_product_photo: "/update_product_photo/:pid";
  delete_product: "/delete_product/:pid";
  create_product_ratings: "/create_product_ratings/:pid";
  get_all_reviews: "/get_all_reviews/:pid";
  update_product_review: "/update_product_review/:pid/:reviewId";
  deleteProduct_review: "/delete_product_review/:pid/:reviewId"
}

const product_routes: Iproduct = {
  category: "/create_category",
  delete_category: "/delete_category",
  find_cetegory: "/category",
  create_product: "/create_product",
  getSingle_product: "/getSingle_Product/:pid",
  getAll_products: "/getAll_products",
  update_product_details: "/update_product_details/:pid",
  update_product_photo: "/update_product_photo/:pid",
  delete_product: "/delete_product/:pid",
  create_product_ratings: "/create_product_ratings/:pid",
  get_all_reviews: "/get_all_reviews/:pid",
  update_product_review: "/update_product_review/:pid/:reviewId",
  deleteProduct_review: "/delete_product_review/:pid/:reviewId"
};

// create category
router
  .route(product_routes.category)
  .post(veryfyJWT, isAdmin, zodValidator(ZodcategorySchema), category);

// delete category
router.route(product_routes.delete_category).delete(veryfyJWT, isAdmin, deleteCategory)

// get all categoroy
router.route(product_routes.find_cetegory).get(getCategory);
// create new product
router
  .route(product_routes.create_product)
  .post(veryfyJWT, isAdmin, upload.single("photo"), createProduct); // todo - zod validator add later
// get single product by id
router.route(product_routes.getSingle_product).get(cacheMiddleware, getSingleProduct);
// get all products
router.route(product_routes.getAll_products).get(cacheMiddleware, getAllProducts);
// update product details
router
  .route(product_routes.update_product_details)
  .patch(veryfyJWT, isAdmin, updateProductsDetails);
// update product photo
router
  .route(product_routes.update_product_photo)
  .patch(veryfyJWT, isAdmin, upload.single("photo"), updateProductPhoto);
// delete product by id
router
  .route(product_routes.delete_product)
  .delete(veryfyJWT, isAdmin, deleteProduct);
// create product ratings
router.route(product_routes.create_product_ratings).post(veryfyJWT, createRatings);
// get all reviews of product
router.route(product_routes.get_all_reviews).get(cacheMiddleware, getAllReviewsOfProduct);
// update reviews of product
router.route(product_routes.update_product_review).put(veryfyJWT, updateReview);
// delete product review
router.route(product_routes.deleteProduct_review).delete(veryfyJWT, deleteProduct_Reviews)

export default router;
