import { z } from 'zod';
import { ProjectRole } from '@prisma/client';

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    key: z.string().min(2).max(10).regex(/^[A-Z0-9]+$/),
    description: z.string().optional(),
  }),
});

export const updateProjectSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    status: z.enum(['ACTIVE', 'ARCHIVED']).optional(),
  }),
});

export const memberSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    userId: z.string(),
    projectRole: z.nativeEnum(ProjectRole).optional().default(ProjectRole.MEMBER),
  }),
});

export const updateMemberSchema = z.object({
  params: z.object({ id: z.string(), userId: z.string() }),
  body: z.object({
    projectRole: z.nativeEnum(ProjectRole),
  }),
});
