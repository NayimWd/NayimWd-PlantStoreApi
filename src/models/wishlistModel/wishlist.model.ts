import mongoose, { Schema } from "mongoose";
import { IWishlist, IWishlistItem } from "../../types/productTypes";

const wishlistItemSchema: Schema<IWishlistItem> = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product Id required for wishlist item"],
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const wishlistSchema = new Schema({
  listedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User required to create wishlist"],
  },
  wishlistItems: [wishlistItemSchema],
});

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);