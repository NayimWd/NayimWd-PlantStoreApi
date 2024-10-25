import { Router } from "express";
import { veryfyJWT } from "../middlewares/auth.middleware";
import { createOrderFromCart } from "../controllers/order";

const router = Router();

interface IOrderRoutes {
    create_Order_FromCart : "/create_order",
}

const orderRoutes: IOrderRoutes = {
    create_Order_FromCart: "/create_order"
}


// create order
router.route(orderRoutes.create_Order_FromCart).post(veryfyJWT, createOrderFromCart);


export default router;