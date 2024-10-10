import { Router } from "express";
import {
  loginUser,
  register,
  logOutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
} from "../controllers/users/index";
import zodValidator from "../middlewares/validator.middleware";
import { zodRegisterSchema, zodLoginSchema } from "../validator";
import { upload } from "../middlewares/multer.middleware";
import { veryfyJWT } from "../middlewares/auth.middleware";

const router: Router = Router();

interface IUserRoute {
  base_path: "/";
  register: "/register";
  login: "/login";
  logout: "/logout";
  refreshToken: "/refreshToken";
  changePassword: "/changePassword";
  currentUser: "/currentUser";
  updateAccountDetails: "/update_account_details";
  updateAvatar: "/update_avatar";
}

const user_routes: IUserRoute = {
  base_path: "/",
  register: "/register",
  login: "/login",
  logout: "/logout",
  refreshToken: "/refreshToken",
  changePassword: "/changePassword",
  currentUser: "/currentUser",
  updateAccountDetails: "/update_account_details",
  updateAvatar: "/update_avatar",
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
router.route(user_routes.logout).post(veryfyJWT, logOutUser);
// refresh token
router.route(user_routes.refreshToken).post(refreshAccessToken);
// get current user
router.route(user_routes.currentUser).get(veryfyJWT, getCurrentUser);
// change password
router.route(user_routes.changePassword).post(veryfyJWT, changeCurrentPassword);
// change user details
router
  .route(user_routes.updateAccountDetails)
  .patch(veryfyJWT, updateAccountDetails);
  // change avtar
router.route(user_routes.updateAvatar).patch(veryfyJWT, updateAvatar);

export default router;
