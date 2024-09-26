import mongoose, { Schema } from "mongoose";
import { IWishlist } from "../../types/productTypes";

const wishList_Item: Schema<IWishlist> = new Schema({
  listedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User required for create wishlist"],
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product required for create wishlist"],
  },
});

export const Wishlist = mongoose.model<IWishlist>("Wishlist", wishList_Item);
