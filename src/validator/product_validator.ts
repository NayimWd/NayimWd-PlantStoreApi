import mongoose from "mongoose";
import z from "zod";

// Define the enum values
const categoryEnum = ["Flower", "Fruit", "Herb", "Indoor", "Garden"] as const;

export const ZodcategorySchema = z.object({
  name: z
    .enum(categoryEnum, {
      required_error: "Category is required",
      invalid_type_error: "Invalid category",
    })
    .default("Garden"), // Default to "Garden"
});

// product validator

// Enum for size
const sizeEnum = ["S", "M", "L", "XL", "standard"] as const;

export const ZodProductSchema = z.object({
  title: z
    .string({
      required_error: "Product title is required.",
    })
    .min(1, "Title cannot be empty"),
  description: z
    .string({
      required_error: "Product description is required",
    })
    .min(1, "Description is empty"),
  category: z
    .string({ required_error: "Category is required" })
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid category Id",
    }),
  size: z.enum(sizeEnum, { message: "Size is required" }).default("standard"),
  price: z
    .number({ required_error: "Price is required" })
    .positive("Price must have a positive number"),
  stock: z.number().min(0, "stock can not be negative").default(0),
  isActive: z.boolean().default(true),
  photo: z
    .string({ required_error: "Product Photo is required" })
    .url("Invalid Url from product photo"),
});
