import { Router } from "express";
import { veryfyJWT } from "../middlewares/auth.middleware";
import { addToCart, deleteCartItem, getUserCart, updateCart } from "../controllers/cart";

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
router.route(cartRoutes.get_cartItem).get(veryfyJWT, getUserCart);
// update cart 
router.route(cartRoutes.update_cart).put(veryfyJWT, updateCart);
// remove cart item
router.route(cartRoutes.remove_cart).delete(veryfyJWT, deleteCartItem);


export default router;