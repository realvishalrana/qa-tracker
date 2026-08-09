import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../common/types';
import { sendSuccess } from '../../common/response';
import { attachmentsService } from './attachments.service';

export class AttachmentsController {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const items = await attachmentsService.list(req.params.bugId, req.user!);
      return sendSuccess(res, items);
    } catch (err) {
      next(err);
    }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const item = await attachmentsService.create(req.params.bugId, req.user!, req.file);
      return sendSuccess(res, item, 201);
    } catch (err) {
      next(err);
    }
  }

  async download(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const item = await attachmentsService.getForDownload(req.params.id, req.user!);
      return res.download(item.path, item.originalName);
    } catch (err) {
      next(err);
    }
  }

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await attachmentsService.remove(req.params.id, req.user!);
      return sendSuccess(res, { message: 'Attachment deleted' });
    } catch (err) {
      next(err);
    }
  }
}

export const attachmentsController = new AttachmentsController();
