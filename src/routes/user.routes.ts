import { Router } from "express";
import { loginUser, register, logOutUser } from "../controllers/users/index";
import zodValidator from "../middlewares/validator.middleware";
import { zodRegisterSchema, zodLoginSchema } from "../validator";
import { upload } from "../middlewares/multer.middleware";
import { veryfyJWT } from "../middlewares/auth.middleware";


const router: Router = Router();

interface IUserRoute {
  base_path: "/";
  register: "/register";
  login: "/login";
  logout: "/logout"
}

const user_routes: IUserRoute = {
  base_path: "/",
  register: "/register",
  login: "/login",
   logout: "/logout",
};

// routes
// register
router
  .route(user_routes.register)
  .post(
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    zodValidator(zodRegisterSchema),
    register
  );

// login
router.route(user_routes.login).post(zodValidator(zodLoginSchema), loginUser);

// logout
router.route(user_routes.logout).post(veryfyJWT, logOutUser)

export default router;
