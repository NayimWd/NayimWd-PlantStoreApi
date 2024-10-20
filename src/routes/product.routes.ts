import { Router } from "express";
import {
  category,
  createProduct,
  createRatings,
  deleteProduct,
  getAllProducts,
  getCategory,
  getSingleProduct,
  updateProductPhoto,
  updateProductsDetails,
} from "../controllers/product";
import { isAdmin, veryfyJWT } from "../middlewares/auth.middleware";
import zodValidator from "../middlewares/validator.middleware";
import { ZodcategorySchema } from "../validator";
import { ZodProductSchema } from "../validator/product_validator";
import { upload } from "../middlewares/multer.middleware";
import { updateAccountDetails } from "../controllers/users";

const router: Router = Router();

interface Iproduct {
  category: "/create_category";
  find_cetegory: "/category";
  create_product: "/create_product";
  getSingle_product: "/getSingle_Product/:pid";
  getAll_products: "/getAll_products";
  update_product_details: "/update_product_details/:pid";
  update_product_photo: "/update_product_photo/:pid";
  delete_product: "/delete_product/:pid";
  create_product_ratings: "/create_product_ratings/:pid";
}

const product_routes: Iproduct = {
  category: "/create_category",
  find_cetegory: "/category",
  create_product: "/create_product",
  getSingle_product: "/getSingle_Product/:pid",
  getAll_products: "/getAll_products",
  update_product_details: "/update_product_details/:pid",
  update_product_photo: "/update_product_photo/:pid",
  delete_product: "/delete_product/:pid",
  create_product_ratings: "/create_product_ratings/:pid",
};

// create category
router
  .route(product_routes.category)
  .post(veryfyJWT, isAdmin, zodValidator(ZodcategorySchema), category);
// get all categoroy
router.route(product_routes.find_cetegory).get(getCategory);
// create new product
router
  .route(product_routes.create_product)
  .post(veryfyJWT, isAdmin, upload.single("photo"), createProduct); // todo - zod validator add later
// get single product by id
router.route(product_routes.getSingle_product).get(getSingleProduct);
// get all products
router.route(product_routes.getAll_products).get(getAllProducts);
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
router.route(product_routes.create_product_ratings).post(veryfyJWT, createRatings)

export default router;
