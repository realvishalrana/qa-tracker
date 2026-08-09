import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../common/types';
import { sendSuccess } from '../../common/response';
import { notificationsService } from './notifications.service';

export class NotificationsController {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 20);
      const result = await notificationsService.list(req.user!.id, page, limit);
      return sendSuccess(res, result.items, 200, {
        total: result.total,
        page: result.page,
        limit: result.limit,
      });
    } catch (err) {
      next(err);
    }
  }

  async unreadCount(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const count = await notificationsService.unreadCount(req.user!.id);
      return sendSuccess(res, { count });
    } catch (err) {
      next(err);
    }
  }

  async markRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await notificationsService.markRead(req.params.id, req.user!.id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async markAllRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await notificationsService.markAllRead(req.user!.id);
      return sendSuccess(res, { message: 'All notifications marked as read' });
    } catch (err) {
      next(err);
    }
  }
}

export const notificationsController = new NotificationsController();
