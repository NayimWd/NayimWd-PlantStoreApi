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
  getAllUsers,
  forgotPassword,
  resetPassword
} from "../controllers/users/index";
import zodValidator from "../middlewares/validator.middleware";
import { zodRegisterSchema, zodLoginSchema } from "../validator";
import { upload } from "../middlewares/multer.middleware";
import { isAdmin, veryfyJWT } from "../middlewares/auth.middleware";

const router: Router = Router();

interface IUserRoute {
  base_path: "/";
  register: "/register";
  login: "/login";
  logout: "/logout";
  refreshToken: "/refreshToken";
  changePassword: "/changePassword";
  currentUser: "/currentUser";
  allUsers: "/all_users";
  updateAccountDetails: "/update_account_details";
  updateAvatar: "/update_avatar";
  forgotPassword: "/forgot_password";
  resetPassword: "/reset_password/:token";
}

const user_routes: IUserRoute = {
  base_path: "/",
  register: "/register",
  login: "/login",
  logout: "/logout",
  refreshToken: "/refreshToken",
  changePassword: "/changePassword",
  currentUser: "/currentUser",
  allUsers: "/all_users",
  updateAccountDetails: "/update_account_details",
  updateAvatar: "/update_avatar",
  forgotPassword: "/forgot_password",
  resetPassword: "/reset_password/:token"
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
// get all user
router.route(user_routes.allUsers).get(veryfyJWT, isAdmin, getAllUsers);
// change password
router.route(user_routes.changePassword).patch(veryfyJWT, changeCurrentPassword);
// change user details
router
  .route(user_routes.updateAccountDetails)
  .patch(veryfyJWT, updateAccountDetails);
  // change avtar
router.route(user_routes.updateAvatar).patch(veryfyJWT, upload.single("avatar"), updateAvatar);
// forgot password 
router.route(user_routes.forgotPassword).post(veryfyJWT, forgotPassword);
router.route(user_routes.resetPassword).put(veryfyJWT, resetPassword);

export default router;
