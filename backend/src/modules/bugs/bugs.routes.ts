import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requirePermission } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { auditLogger } from '../../middlewares/audit.middleware';
import { PERMISSIONS } from '../../common/permissions';
import {
  assignSchema,
  listBugsSchema,
  statusSchema,
  updateBugSchema,
} from './bugs.dto';
import { bugsController } from './bugs.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', validate(listBugsSchema), (req, res, next) => bugsController.list(req, res, next));
router.get('/:id', (req, res, next) => bugsController.getById(req, res, next));
router.patch(
  '/:id',
  requirePermission(PERMISSIONS.BUG_UPDATE),
  validate(updateBugSchema),
  auditLogger('UPDATE_BUG', 'Bug'),
  (req, res, next) => bugsController.update(req, res, next)
);
router.patch(
  '/:id/status',
  requirePermission(PERMISSIONS.BUG_STATUS),
  validate(statusSchema),
  (req, res, next) => bugsController.updateStatus(req, res, next)
);
router.patch(
  '/:id/assign',
  requirePermission(PERMISSIONS.BUG_ASSIGN),
  validate(assignSchema),
  (req, res, next) => bugsController.assign(req, res, next)
);
router.delete(
  '/:id',
  requirePermission(PERMISSIONS.BUG_DELETE),
  (req, res, next) => bugsController.remove(req, res, next)
);
router.get('/:id/history', (req, res, next) => bugsController.history(req, res, next));
router.get('/:id/timeline', (req, res, next) => bugsController.timeline(req, res, next));

export default router;
