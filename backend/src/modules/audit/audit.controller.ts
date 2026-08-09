import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../common/types';
import { sendSuccess } from '../../common/response';
import { auditService } from './audit.service';

export class AuditController {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await auditService.list({
        page: Number(req.query.page || 1),
        limit: Number(req.query.limit || 50),
        actorId: req.query.actorId as string | undefined,
        action: req.query.action as string | undefined,
        entityType: req.query.entityType as string | undefined,
        from: req.query.from as string | undefined,
        to: req.query.to as string | undefined,
      });
      return sendSuccess(res, result.items, 200, {
        total: result.total,
        page: result.page,
        limit: result.limit,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const auditController = new AuditController();
