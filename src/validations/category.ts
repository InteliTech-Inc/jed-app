import * as z from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces allowed"),
});

export const categoriesSchema = z.object({
  categories: z
    .array(categorySchema)
    .min(1, "At least one category is required")
    .max(5, "You can only create up to 5 categories"),
});

export type FormData = z.infer<typeof categoriesSchema>;
