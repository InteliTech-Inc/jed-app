import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .nonempty("Email is required!")
      .email("Invalid email address"),
    token: z.string().nonempty("Reset token is required!"),
    password: z
      .string()
      .nonempty("Password is required!")
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().nonempty("Please confirm your password!"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
