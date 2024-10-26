import { Router } from "express";
import { veryfyJWT } from "../middlewares/auth.middleware";
import { createOrderFromCart, createOrderfromWishlist } from "../controllers/order";

const router = Router();

interface IOrderRoutes {
    create_Order_FromCart : "/create_cart_order",
    create_Order_FromWishlist : "/create_wishlist_order",
}

const orderRoutes: IOrderRoutes = {
    create_Order_FromCart: "/create_cart_order",
    create_Order_FromWishlist: "/create_wishlist_order"
}


// create order from cart
router.route(orderRoutes.create_Order_FromCart).post(veryfyJWT, createOrderFromCart);
// create order from wishlist
router.route(orderRoutes.create_Order_FromWishlist).post(veryfyJWT, createOrderfromWishlist)


export default router;