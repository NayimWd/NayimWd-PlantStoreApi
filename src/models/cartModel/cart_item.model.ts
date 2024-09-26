import mongoose, {Schema} from "mongoose";
import { ICart_Item } from "../../types/productTypes";


const cartItemSchema: Schema<ICart_Item> = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    price: Number,
    quantity: Number,
    totalPrice: Number
})


export const CartItem = mongoose.model<ICart_Item>("CartItem", cartItemSchema);