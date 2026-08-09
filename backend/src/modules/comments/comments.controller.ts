import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../common/types';
import { sendSuccess } from '../../common/response';
import { commentsService } from './comments.service';

export class CommentsController {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const items = await commentsService.list(req.params.bugId, req.user!);
      return sendSuccess(res, items);
    } catch (err) {
      next(err);
    }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const item = await commentsService.create(req.params.bugId, req.body.body, req.user!);
      return sendSuccess(res, item, 201);
    } catch (err) {
      next(err);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const item = await commentsService.update(req.params.id, req.body.body, req.user!);
      return sendSuccess(res, item);
    } catch (err) {
      next(err);
    }
  }

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await commentsService.remove(req.params.id, req.user!);
      return sendSuccess(res, { message: 'Comment deleted' });
    } catch (err) {
      next(err);
    }
  }
}

export const commentsController = new CommentsController();
