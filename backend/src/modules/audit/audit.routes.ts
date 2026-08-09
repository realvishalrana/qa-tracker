import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requirePermission } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { PERMISSIONS } from '../../common/permissions';
import { listAuditLogsSchema } from './audit.dto';
import { auditController } from './audit.controller';

const router = Router();
router.use(authMiddleware);
router.use(requirePermission(PERMISSIONS.AUDIT_READ));

router.get('/', validate(listAuditLogsSchema), (req, res, next) =>
  auditController.list(req, res, next)
);

export default router;
