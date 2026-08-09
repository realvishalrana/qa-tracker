import { z } from 'zod';

export const createFeatureSchema = z.object({
  params: z.object({ projectId: z.string() }),
  body: z.object({
    name: z.string().min(2),
    description: z.string().optional(),
  }),
});

export const updateFeatureSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
  }),
});
