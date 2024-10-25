import mongoose, { Schema } from "mongoose";
import { IWishlist, IWishlistItem } from "../../types/productTypes";

const wishlistItemSchema: Schema<IWishlistItem> = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product required for wishlist item"],
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const wishlistSchema: Schema<IWishlist> = new Schema({
  listedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User required to create wishlist"],
  },
  wishlistItems: [wishlistItemSchema],
});

export const Wishlist = mongoose.model<IWishlist>("Wishlist", wishlistSchema);