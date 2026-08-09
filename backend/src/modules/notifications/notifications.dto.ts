import { z } from 'zod';

export const listNotificationsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const notificationIdSchema = z.object({
  params: z.object({ id: z.string() }),
});
