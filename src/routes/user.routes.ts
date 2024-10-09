import { Router } from "express";
import { register } from "../controllers/users/index";
import zodValidator from "../middlewares/validator.middleware";
import { zodRegisterSchema, zodLoginSchema } from "../validator";
import { upload } from "../middlewares/multer.middleware";

const router: Router = Router();

interface IUserRoute {
  base_path: "/";
  register: "/register";
  login: "/login";
}

const user_routes: IUserRoute = {
  base_path: "/",
  register: "/register",
  login: "/login",
};

// routes
router
  .route(user_routes.register)
  .post(
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    zodValidator(zodRegisterSchema),
    register
  );

export default router;