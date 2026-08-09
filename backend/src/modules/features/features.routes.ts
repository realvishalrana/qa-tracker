import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requirePermission } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { PERMISSIONS } from '../../common/permissions';
import { createFeatureSchema, updateFeatureSchema } from './features.dto';
import { featuresController } from './features.controller';

const router = Router();

router.use(authMiddleware);

router.get('/projects/:projectId/features', (req, res, next) =>
  featuresController.list(req, res, next)
);
router.post(
  '/projects/:projectId/features',
  requirePermission(PERMISSIONS.FEATURE_CREATE),
  validate(createFeatureSchema),
  (req, res, next) => featuresController.create(req, res, next)
);
router.get('/features/:id', (req, res, next) => featuresController.getById(req, res, next));
router.patch(
  '/features/:id',
  requirePermission(PERMISSIONS.FEATURE_UPDATE),
  validate(updateFeatureSchema),
  (req, res, next) => featuresController.update(req, res, next)
);
router.delete(
  '/features/:id',
  requirePermission(PERMISSIONS.FEATURE_DELETE),
  (req, res, next) => featuresController.remove(req, res, next)
);

export default router;
