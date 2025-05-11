import * as z from "zod";

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[@$!%*?&]/, "Password must contain at least one special character")
  .regex(/\d/, "Password must contain at least one number");

export const signUpFormSchema = z.object({
  fullName: z
    .string()
    .regex(/^[a-zA-Z\s]+$/, "Full Name must contain only letters and spaces")
    .min(3, "Full Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone_number: z
    .string()
    .regex(/^\+?\d{10,15}$/, "Phone number must be between 10 and 15 digits"),
  password: passwordSchema,
});

export const loginFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
});
