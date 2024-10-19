import { Router } from "express"
import { category, createProduct, getCategory } from "../controllers/product";
import { isAdmin, veryfyJWT } from "../middlewares/auth.middleware";
import zodValidator from "../middlewares/validator.middleware";
import { ZodcategorySchema } from "../validator";
import { ZodProductSchema } from "../validator/product_validator";
import { upload } from "../middlewares/multer.middleware";


const router:Router = Router();

interface Iproduct {
    category: "/create_category",
    find_cetegory: "/category",
    create_product: "/create_product"
}


const product_routes : Iproduct = {
    category: "/create_category",
    find_cetegory: "/category",
    create_product: "/create_product"
}

// create category
router.route(product_routes.category).post(veryfyJWT, isAdmin, zodValidator(ZodcategorySchema), category)
// get all categoroy
router.route(product_routes.find_cetegory).get(getCategory)
// create new product
router.route(product_routes.create_product).post(veryfyJWT, isAdmin, upload.single("photo"), createProduct) // todo - zod validator add later

export default router;