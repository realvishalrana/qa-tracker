import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../common/types';
import { sendSuccess } from '../../common/response';
import { bugsService } from './bugs.service';

export class BugsController {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await bugsService.list(req.user!, req.query as Record<string, string | undefined>);
      return sendSuccess(res, result.items, 200, {
        total: result.total,
        page: result.page,
        limit: result.limit,
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const item = await bugsService.getById(req.params.id, req.user!);
      return sendSuccess(res, item);
    } catch (err) {
      next(err);
    }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const item = await bugsService.create(req.params.projectId, req.body, req.user!);
      return sendSuccess(res, item, 201);
    } catch (err) {
      next(err);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const item = await bugsService.update(req.params.id, req.body, req.user!);
      return sendSuccess(res, item);
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const item = await bugsService.updateStatus(req.params.id, req.body.status, req.user!);
      return sendSuccess(res, item);
    } catch (err) {
      next(err);
    }
  }

  async assign(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const item = await bugsService.assign(req.params.id, req.body.assigneeId, req.user!);
      return sendSuccess(res, item);
    } catch (err) {
      next(err);
    }
  }

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const item = await bugsService.remove(req.params.id, req.user!);
      return sendSuccess(res, item);
    } catch (err) {
      next(err);
    }
  }

  async history(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const items = await bugsService.history(req.params.bugId || req.params.id, req.user!);
      return sendSuccess(res, items);
    } catch (err) {
      next(err);
    }
  }

  async timeline(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const items = await bugsService.timeline(req.params.bugId || req.params.id, req.user!);
      return sendSuccess(res, items);
    } catch (err) {
      next(err);
    }
  }
}

export const bugsController = new BugsController();
