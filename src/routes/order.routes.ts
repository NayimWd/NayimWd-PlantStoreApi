import { Router } from "express";
import { veryfyJWT } from "../middlewares/auth.middleware";
import { cancelOrder, createOrderFromCart, createOrderfromWishlist, getAllOrders, orderUpdate } from "../controllers/order";

const router = Router();

interface IOrderRoutes {
    create_Order_FromCart : "/create_cart_order",
    create_Order_FromWishlist : "/create_wishlist_order",
    get_all_orders: "/get_all_orders",
    update_order: "/update_order/:orderId",
    cancel_order: "/cancel_order/:orderId"
}

const orderRoutes: IOrderRoutes = {
    create_Order_FromCart: "/create_cart_order",
    create_Order_FromWishlist: "/create_wishlist_order",
    get_all_orders: "/get_all_orders",
    update_order: "/update_order/:orderId",
    cancel_order: "/cancel_order/:orderId"
}


// create order from cart
router.route(orderRoutes.create_Order_FromCart).post(veryfyJWT, createOrderFromCart);
// create order from wishlist
router.route(orderRoutes.create_Order_FromWishlist).post(veryfyJWT, createOrderfromWishlist)
// get all orders
router.route(orderRoutes.get_all_orders).get(veryfyJWT, getAllOrders);
// update order (example: qty, price)
router.route(orderRoutes.update_order).patch(veryfyJWT, orderUpdate)
// cancel order
router.route(orderRoutes.cancel_order).put(veryfyJWT, cancelOrder)
export default router;