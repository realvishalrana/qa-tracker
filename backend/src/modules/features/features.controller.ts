import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../common/types';
import { sendSuccess } from '../../common/response';
import { featuresService } from './features.service';

export class FeaturesController {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const items = await featuresService.list(req.params.projectId, req.user!);
      return sendSuccess(res, items);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const item = await featuresService.getById(req.params.id, req.user!);
      return sendSuccess(res, item);
    } catch (err) {
      next(err);
    }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const item = await featuresService.create(req.params.projectId, req.body, req.user!);
      return sendSuccess(res, item, 201);
    } catch (err) {
      next(err);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const item = await featuresService.update(req.params.id, req.body, req.user!);
      return sendSuccess(res, item);
    } catch (err) {
      next(err);
    }
  }

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const item = await featuresService.remove(req.params.id, req.user!);
      return sendSuccess(res, item);
    } catch (err) {
      next(err);
    }
  }
}

export const featuresController = new FeaturesController();
