import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requirePermission } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { PERMISSIONS } from '../../common/permissions';
import { exportReportSchema } from './reports.dto';
import { reportsController } from './reports.controller';

const router = Router();
router.use(authMiddleware);

router.get('/bugs-by-status', requirePermission(PERMISSIONS.REPORTS_READ), (req, res, next) =>
  reportsController.byStatus(req, res, next)
);

router.get('/bugs-by-severity', requirePermission(PERMISSIONS.REPORTS_READ), (req, res, next) =>
  reportsController.bySeverity(req, res, next)
);

router.get('/bugs-by-assignee', requirePermission(PERMISSIONS.REPORTS_READ), (req, res, next) =>
  reportsController.byAssignee(req, res, next)
);

router.get('/resolution-time', requirePermission(PERMISSIONS.REPORTS_READ), (req, res, next) =>
  reportsController.resolutionTime(req, res, next)
);

router.get(
  '/export',
  requirePermission(PERMISSIONS.REPORTS_EXPORT),
  validate(exportReportSchema),
  (req, res, next) => reportsController.export(req, res, next)
);

export default router;
