import z from "zod";

export const zodLoginSchema = z.object({
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
});


