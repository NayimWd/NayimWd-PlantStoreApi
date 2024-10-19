import { Router } from "express"
import { category, getCategory } from "../controllers/product";
import { isAdmin, veryfyJWT } from "../middlewares/auth.middleware";
import zodValidator from "../middlewares/validator.middleware";
import { ZodcategorySchema } from "../validator";


const router:Router = Router();

interface Iproduct {
    category: "/create_category",
    find_cetegory: "/category"
}


const product_routes : Iproduct = {
    category: "/create_category",
    find_cetegory: "/category"
}

// create category
router.route(product_routes.category).post(veryfyJWT, isAdmin, zodValidator(ZodcategorySchema), category)
router.route(product_routes.find_cetegory).get(getCategory)

export default router;