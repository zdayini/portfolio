import { z } from 'zod';

export const concertFormSchema = z.object({
  artist: z.string().min(1, 'Artist is required'),
  venue: z.string().min(1, 'Venue is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  date: z.string().min(1, 'Date is required'),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  title: z.string().optional(),
});

export type ConcertFormValues = z.infer<typeof concertFormSchema>;