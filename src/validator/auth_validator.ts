import { z } from "zod";
import { IUser } from "../types/userTypes";

// creating user schema using zod

export const zodRegisterSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .trim()
    .min(3, { message: "Name must be minimum 3 character" })
    .max(100, { message: "Name must not be more that 100 character" }),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid Email address" })
    .min(5, { message: "Email must be minimum 5 character" })
    .max(60, { message: "Email must be under 60 character" }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, { message: "password must be minimum 6 character" })
    .max(332, { message: "password must be under 332 character" }),
  phoneNumber: z
    .string({
      required_error: "phone Number is required",
    })
    .trim()
    .min(10, { message: "phone number must be minimum 10 character" })
    .max(15, { message: "phone number must be under 15 character" }),
  role: z.enum(["user", "admin"]).default("user"),
  avatar: z.string().url().optional(),
  refreshToken: z.string().optional(),
});


