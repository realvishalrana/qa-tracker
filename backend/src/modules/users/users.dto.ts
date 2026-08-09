import { z } from 'zod';
import { SYSTEM_ROLE_NAMES } from '../../common/permissions';

export const listUsersSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
    roleNames: z.array(z.string()).optional(),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    name: z.string().min(2).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateRolesSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    roleNames: z
      .array(z.string())
      .min(1)
      .refine((names) => names.every((n) => SYSTEM_ROLE_NAMES.includes(n)), {
        message: 'Invalid system role',
      }),
  }),
});
