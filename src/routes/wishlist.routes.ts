import { Router } from "express"
import { veryfyJWT } from "../middlewares/auth.middleware";
import { addToWishlist, getWisht_Item, removeWishlist_Item } from "../controllers/wishlist";


interface IWishListRoutes {
    add_To_Wishlist: "/add_to_wishlist",
    get_from_wishlist: "/get_from_wishlist",
    delete_from_wishlist: "/delete_from_wishlist"
};

const wishlis_routes: IWishListRoutes = {
    add_To_Wishlist: "/add_to_wishlist",
    get_from_wishlist: "/get_from_wishlist",
    delete_from_wishlist: "/delete_from_wishlist"
}

const router = Router();

// routes
// add to wishlist
router.route(wishlis_routes.add_To_Wishlist).post(veryfyJWT, addToWishlist);

// get items from wishlist
router.route(wishlis_routes.get_from_wishlist).get(veryfyJWT, getWisht_Item)

// remode item from wishlist
router.route(wishlis_routes.delete_from_wishlist).delete(veryfyJWT, removeWishlist_Item)

export default router;