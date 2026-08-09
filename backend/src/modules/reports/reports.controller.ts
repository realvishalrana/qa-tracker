import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../common/types';
import { sendSuccess } from '../../common/response';
import { reportsService } from './reports.service';

export class ReportsController {
  async byStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await reportsService.byStatus(req.user!));
    } catch (err) {
      next(err);
    }
  }

  async bySeverity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await reportsService.bySeverity(req.user!));
    } catch (err) {
      next(err);
    }
  }

  async byAssignee(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await reportsService.byAssignee(req.user!));
    } catch (err) {
      next(err);
    }
  }

  async resolutionTime(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, await reportsService.resolutionTime(req.user!));
    } catch (err) {
      next(err);
    }
  }

  async export(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await reportsService.export(req.user!, (req.query.type as string) || 'json');
      if (result.format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=bugs-export.csv');
        return res.send(result.content);
      }
      return sendSuccess(res, result.content);
    } catch (err) {
      next(err);
    }
  }
}

export const reportsController = new ReportsController();
