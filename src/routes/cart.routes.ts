import { Router } from "express";
import { veryfyJWT } from "../middlewares/auth.middleware";
import { addToCart, getUserCart } from "../controllers/cart";

const router = Router();

interface ICartRoutes {
    addTo_cart: "/add_to_cart",
    get_cartItem: "/get_cart_items",
    remove_cart: "/remove_cart_item"
    update_cart: "/update_cart_item"
}

const cartRoutes: ICartRoutes = {
    addTo_cart: "/add_to_cart",
    get_cartItem: "/get_cart_items",
    remove_cart: "/remove_cart_item",
    update_cart: "/update_cart_item"
}


// routes
// add to cart
router.route(cartRoutes.addTo_cart).post(veryfyJWT, addToCart);
// get cart item
router.route(cartRoutes.get_cartItem).get(veryfyJWT, getUserCart)


export default router;