import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../common/types';
import { sendSuccess } from '../../common/response';
import { dashboardService } from './dashboard.service';

export class DashboardController {
  async summary(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await dashboardService.summary(req.user!));
    } catch (err) {
      next(err);
    }
  }

  async charts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await dashboardService.charts(req.user!));
    } catch (err) {
      next(err);
    }
  }

  async myWork(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await dashboardService.myWork(req.user!));
    } catch (err) {
      next(err);
    }
  }
}

export const dashboardController = new DashboardController();
