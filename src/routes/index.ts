import express, { Request, Response } from "express";
import userRoutes from "./user.routes";

// Create a central router to handle all routes
const router = express.Router();
// creating interface for semi root routes path
interface IRoutePath {
  health: "/api/v1/health";
  user_auth: "/api/v1/auth/users";
}
// creating semi root path
const route_path: IRoutePath = {
  health: "/api/v1/health",
  user_auth: "/api/v1/auth/users",
};

// Health check route
const healthCheck = (req: Request, res: Response) => {
  return res.status(200).json({ message: "API Health check" });
};

// Define health check route
router.get(route_path.health, healthCheck);
router.use(route_path.user_auth, userRoutes);

export default router;
