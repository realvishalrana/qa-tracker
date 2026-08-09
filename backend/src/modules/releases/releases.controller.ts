import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../common/types';
import { sendSuccess } from '../../common/response';
import { releasesService } from './releases.service';

export class ReleasesController {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await releasesService.list(req.params.projectId, req.user!));
    } catch (err) {
      next(err);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await releasesService.getById(req.params.id, req.user!));
    } catch (err) {
      next(err);
    }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      return sendSuccess(
        res,
        await releasesService.create(req.params.projectId, req.body, req.user!),
        201
      );
    } catch (err) {
      next(err);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await releasesService.update(req.params.id, req.body, req.user!));
    } catch (err) {
      next(err);
    }
  }

  async linkBugs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      return sendSuccess(
        res,
        await releasesService.linkBugs(req.params.id, req.body.bugIds, req.user!)
      );
    } catch (err) {
      next(err);
    }
  }

  async unlinkBug(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      return sendSuccess(
        res,
        await releasesService.unlinkBug(req.params.id, req.params.bugId, req.user!)
      );
    } catch (err) {
      next(err);
    }
  }

  async publish(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await releasesService.publish(req.params.id, req.user!));
    } catch (err) {
      next(err);
    }
  }
}

export const releasesController = new ReleasesController();
