import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const createProjectSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  key: z
    .string()
    .min(2, 'Key must be 2–10 uppercase letters/numbers')
    .max(10, 'Key must be 2–10 uppercase letters/numbers')
    .regex(/^[A-Z0-9]+$/, 'Key must be uppercase letters/numbers only (no spaces)'),
  description: z.string().optional(),
});

export const createBugSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  issueType: z.string().min(1),
  severity: z.string().min(1),
  priority: z.string().min(1),
  description: z.string().optional(),
  featureId: z.string().optional().nullable(),
  expectedResult: z.string().optional(),
  actualResult: z.string().optional(),
  reproductionSteps: z.string().optional(),
});

export const updateBugDetailsSchema = z.object({
  description: z.string().optional(),
  featureId: z.string().optional().nullable(),
  expectedResult: z.string().optional(),
  actualResult: z.string().optional(),
  reproductionSteps: z.string().optional(),
});

export function formatZodError(err: z.ZodError): string {
  return err.issues.map((i) => i.message).join('. ');
}
