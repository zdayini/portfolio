import { z } from 'zod';

export const createConcertSchema = z.object({
    artist: z.string().min(1),
    venue: z.string().min(1),
    city: z.string().min(1),
    country: z.string().min(1),
    date: z.iso.date(),
    rating: z.number().int().min(1).max(5).optional(),
    notes: z.string().optional(),
    image_url: z.url().optional(),
});

export type CreateConcertDto = z.infer<typeof createConcertSchema>;
export const UpdateConcertSchema = createConcertSchema.partial();
export type UpdateConcertDto = z.infer<typeof UpdateConcertSchema>;