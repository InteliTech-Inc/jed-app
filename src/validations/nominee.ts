import { z } from "zod";

export const nomineeSchema = z.object({
  full_name: z.string().min(1, "Full Name is required"),
  category: z.string().min(1, "Category is required"),
  image: z.string().url().optional(),
});

export type NomineeFormData = z.infer<typeof nomineeSchema>;
