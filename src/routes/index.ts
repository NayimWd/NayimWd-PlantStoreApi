import express, { Request, Response } from "express";
import userRoutes from "./user.routes";
import productRoutes from "./product.routes";
import cartRoutes from "./cart.routes";
import wishListRoutes from "./wishlist.routes";

// Create a central router to handle all routes
const router = express.Router();
// creating interface for semi root routes path
interface IRoutePath {
  health: "/api/v1/health";
  user_auth: "/api/v1/auth/users";
  product_routes: "/api/v1/p";
  cart_routes: "/api/v1/cart";
  wishList_routes: "/api/v1/wishList"
}
// creating semi root path
const route_path: IRoutePath = {
  health: "/api/v1/health",
  user_auth: "/api/v1/auth/users",
  product_routes: "/api/v1/p",
  cart_routes: "/api/v1/cart",
  wishList_routes: "/api/v1/wishList"
};

// Health check route
const healthCheck = (req: Request, res: Response) => {
  return res.status(200).json({ message: "API Health check" });
};

// Define health check route
router.get(route_path.health, healthCheck);
// user routes
router.use(route_path.user_auth, userRoutes);
// product routes
router.use(route_path.product_routes, productRoutes)
// cart routes
router.use(route_path.cart_routes, cartRoutes)
// wishlist routes
router.use(route_path.wishList_routes, wishListRoutes)

export default router;
