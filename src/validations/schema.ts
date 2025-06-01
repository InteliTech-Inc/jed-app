import * as z from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

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
  email: z
    .string()
    .nonempty("Email is required!")
    .email("Invalid email address"),
  phone_number: z
    .string()
    .nonempty("Phone number is required")
    .transform((value) => value.replace(/\s+/g, ""))
    .refine(
      (value) => /^\+[1-9]\d{1,14}$/.test(value),
      "Phone number must be in E164 format (e.g., +233559237619)",
    )
    .refine(
      (value) => {
        try {
          return isValidPhoneNumber(value);
        } catch {
          return false;
        }
      },
      { message: "Invalid phone number format" },
    ),
  password: passwordSchema,
});

export const loginFormSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required!")
    .email("Invalid email address"),
  password: passwordSchema,
});
