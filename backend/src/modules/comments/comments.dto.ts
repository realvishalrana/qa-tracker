import { z } from 'zod';

export const createCommentSchema = z.object({
  params: z.object({ bugId: z.string() }),
  body: z.object({ body: z.string().min(1) }),
});

export const updateCommentSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({ body: z.string().min(1) }),
});
