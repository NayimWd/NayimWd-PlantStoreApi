import mongoose, { Document } from "mongoose";

export interface Iproduct extends Document{
    title: string, 
    description: string,
    category: "flower" | "fruit" | "herb" | "indoor" | "garden",
    size: "S" | "M" | "L" | "XL" | "medium",
    price: number,
    stock: number,
    qty: number,
    isActive: boolean,
    photo: string
}

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId,
  productId: mongoose.Types.ObjectId,
  rating: number,
  numberOfRatings: number,
  averageRating: number,
  comment?: string
}