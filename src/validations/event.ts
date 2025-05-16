import * as z from "zod";

export const eventFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  voting_start_period: z.date(),
  voting_end_period: z.date(),
  nomination_start_period: z.date(),
  nomination_end_period: z.date(),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
