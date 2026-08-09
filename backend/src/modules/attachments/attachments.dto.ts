import { z } from 'zod';

export const bugIdParamSchema = z.object({
  params: z.object({ bugId: z.string() }),
});

export const attachmentIdParamSchema = z.object({
  params: z.object({ id: z.string() }),
});
