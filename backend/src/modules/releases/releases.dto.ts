import { ReleaseStatus } from '@prisma/client';
import { z } from 'zod';

export const createReleaseSchema = z.object({
  params: z.object({ projectId: z.string() }),
  body: z.object({
    name: z.string().min(2),
    version: z.string().min(1),
    notes: z.string().optional(),
  }),
});

export const updateReleaseSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().min(2).optional(),
    notes: z.string().optional(),
    status: z.nativeEnum(ReleaseStatus).optional(),
  }),
});

export const linkBugsSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    bugIds: z.array(z.string()).min(1),
  }),
});

export const releaseIdParamSchema = z.object({
  params: z.object({ id: z.string() }),
});

export const projectIdParamSchema = z.object({
  params: z.object({ projectId: z.string() }),
});
