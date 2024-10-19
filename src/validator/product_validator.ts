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