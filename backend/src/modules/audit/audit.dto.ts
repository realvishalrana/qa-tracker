import { z } from 'zod';

export const listAuditLogsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    actorId: z.string().optional(),
    action: z.string().optional(),
    entityType: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
  }),
});
