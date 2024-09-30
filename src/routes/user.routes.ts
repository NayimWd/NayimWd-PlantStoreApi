import { Router } from "express";

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





export default router;