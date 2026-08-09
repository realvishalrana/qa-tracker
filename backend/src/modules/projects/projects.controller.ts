import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../common/types';
import { sendSuccess } from '../../common/response';
import { projectsService } from './projects.service';

export class ProjectsController {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const items = await projectsService.list(req.user!);
      return sendSuccess(res, items);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const item = await projectsService.getById(req.params.id, req.user!);
      return sendSuccess(res, item);
    } catch (err) {
      next(err);
    }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const item = await projectsService.create(req.body, req.user!);
      return sendSuccess(res, item, 201);
    } catch (err) {
      next(err);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const item = await projectsService.update(req.params.id, req.body, req.user!);
      return sendSuccess(res, item);
    } catch (err) {
      next(err);
    }
  }

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const item = await projectsService.remove(req.params.id);
      return sendSuccess(res, item);
    } catch (err) {
      next(err);
    }
  }

  async listMembers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const items = await projectsService.listMembers(req.params.id, req.user!);
      return sendSuccess(res, items);
    } catch (err) {
      next(err);
    }
  }

  async addMember(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const item = await projectsService.addMember(
        req.params.id,
        req.body.userId,
        req.body.projectRole,
        req.user!
      );
      return sendSuccess(res, item, 201);
    } catch (err) {
      next(err);
    }
  }

  async updateMember(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const item = await projectsService.updateMember(
        req.params.id,
        req.params.userId,
        req.body.projectRole,
        req.user!
      );
      return sendSuccess(res, item);
    } catch (err) {
      next(err);
    }
  }

  async removeMember(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await projectsService.removeMember(req.params.id, req.params.userId, req.user!);
      return sendSuccess(res, { message: 'Member removed' });
    } catch (err) {
      next(err);
    }
  }

  async activity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const items = await projectsService.activity(req.params.projectId || req.params.id, req.user!);
      return sendSuccess(res, items);
    } catch (err) {
      next(err);
    }
  }
}

export const projectsController = new ProjectsController();
