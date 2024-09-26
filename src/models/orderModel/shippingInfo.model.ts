import mongoose, { Schema } from "mongoose";
import { IShippingInfo } from "../../types/productTypes";

const shippingInfoSchema: Schema<IShippingInfo> = new Schema({
  contactNumber: {
    type: Number,
    required: [true, "Contact Number is required"],
  },
  city: {
    type: String,
    required: [true, "city is required"],
  },
  zipCode: {
    type: Number,
    required: [true, "Zip code is required"],
  },
  description: String,
});

export const ShippingInfo = mongoose.model<IShippingInfo>(
  "ShippingInfo",
  shippingInfoSchema
);
