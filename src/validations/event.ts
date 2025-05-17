import * as z from "zod";

export const eventFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  voting_start_period: z.date().optional(),
  voting_end_period: z.date().optional(),
  nomination_start_period: z.date().optional(),
  nomination_end_period: z.date().optional(),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
