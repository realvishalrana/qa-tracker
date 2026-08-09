import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../common/types';
import { sendSuccess } from '../../common/response';
import { usersService } from './users.service';

export class UsersController {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 20);
      const result = await usersService.list(req.query.q as string | undefined, page, limit);
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
      const user = await usersService.getById(req.params.id, req.user!);
      return sendSuccess(res, user);
    } catch (err) {
      next(err);
    }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await usersService.create(req.body);
      return sendSuccess(res, user, 201);
    } catch (err) {
      next(err);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await usersService.update(req.params.id, req.body);
      return sendSuccess(res, user);
    } catch (err) {
      next(err);
    }
  }

  async setRoles(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await usersService.setRoles(req.params.id, req.body.roleNames);
      return sendSuccess(res, user);
    } catch (err) {
      next(err);
    }
  }

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await usersService.remove(req.params.id, req.user!);
      return sendSuccess(res, user);
    } catch (err) {
      next(err);
    }
  }
}

export const usersController = new UsersController();
