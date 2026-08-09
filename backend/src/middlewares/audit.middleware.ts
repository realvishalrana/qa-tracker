import { NextFunction, Response } from 'express';
import { prisma } from '../database/prisma';
import { AuthenticatedRequest } from '../common/types';

export function auditLogger(action: string, entityType: string) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);
    res.json = (body: unknown) => {
      const entityId =
        (body as { data?: { id?: string } })?.data?.id ||
        (req.params?.id as string | undefined) ||
        null;

      void prisma.auditLog
        .create({
          data: {
            actorId: req.user?.id,
            action,
            entityType,
            entityId,
            metadata: JSON.stringify({
              method: req.method,
              path: req.originalUrl,
              statusCode: res.statusCode,
            }),
            ip: req.ip,
          },
        })
        .catch((e) => console.error('Audit log failed', e));

      return originalJson(body);
    };
    next();
  };
}
