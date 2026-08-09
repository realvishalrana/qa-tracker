import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../common/types';
import { sendSuccess } from '../../common/response';
import { rolesService } from './roles.service';

export class RolesController {
  async list(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await rolesService.list());
    } catch (err) {
      next(err);
    }
  }
}

export const rolesController = new RolesController();
