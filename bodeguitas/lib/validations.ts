import { z } from "zod";

export const bookingSchema = z.object({
  unitId: z.string().min(1, "Unit is required"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  idDocument: z.string().optional(),
  nationality: z.string().optional(),
  preferredStartDate: z.string().min(1, "Start date is required"),
  notes: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const waitlistSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  preferredSize: z.enum(["QUARTER", "HALF", "FULL"]).optional(),
  notes: z.string().optional(),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;
