import { z } from 'zod';

export const exportReportSchema = z.object({
  query: z.object({
    type: z.enum(['json', 'csv']).optional(),
  }),
});
