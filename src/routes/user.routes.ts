import { Router } from "express";
import { register } from "../controllers/user.controller";

const router: Router = Router();

interface IUserRoute {
    base_path : "/",
    register: "/register",
    login: "/login"
}

const user_routes: IUserRoute = {
    base_path: "/",
    register: "/register",
    login: "/login"
}

router.route(user_routes.register).post(register)



export default router;