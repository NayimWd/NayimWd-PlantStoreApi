import mongoose, { Schema } from "mongoose";
import { ICategory } from "../../types/productTypes";

const categorySchema: Schema<ICategory> = new Schema({
  name: {
    type: String,
    enum: ["Flower", "Fruit", "Herb", "Indoor", "Garden"],
    default: "Garden",
  },
});

export const Category = mongoose.model<ICategory>("Category", categorySchema);
