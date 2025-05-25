import { z } from "zod";

export const nomineeSchema = z.object({
  full_name: z
    .string()
    .nonempty({
      message: "Name is required",
    })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces",
    })
    .min(3, {
      message: "Name must be at least 3 characters",
    }),
  category: z.string().min(1, "Category is required"),
});

export type NomineeFormData = z.infer<typeof nomineeSchema>;

export const updateNomineeSchema = z.object({
  full_name: z
    .string()
    .nonempty({
      message: "Name is required",
    })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces",
    })
    .min(3, {
      message: "Name must be at least 3 characters",
    }),
  email: z
    .string()
    .nonempty({
      message: "Email is required",
    })
    .email({
      message: "Please enter a valid email address",
    }),
  phone: z
    .string()
    .nonempty({
      message: "Phone number is required",
    })
    .regex(/^\d+$/, {
      message: "Phone number can only contain digits",
    })
    .min(10)
    .max(15, {
      message: "Phone number must be between 10 and 15 digits",
    }),
});
