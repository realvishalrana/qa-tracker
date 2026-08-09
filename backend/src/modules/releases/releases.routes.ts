import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requirePermission } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { PERMISSIONS } from '../../common/permissions';
import {
  createReleaseSchema,
  linkBugsSchema,
  updateReleaseSchema,
} from './releases.dto';
import { releasesController } from './releases.controller';

const router = Router();
router.use(authMiddleware);

router.get('/projects/:projectId/releases', (req, res, next) =>
  releasesController.list(req, res, next)
);

router.post(
  '/projects/:projectId/releases',
  requirePermission(PERMISSIONS.RELEASE_MANAGE),
  validate(createReleaseSchema),
  (req, res, next) => releasesController.create(req, res, next)
);

router.get('/releases/:id', (req, res, next) => releasesController.getById(req, res, next));

router.patch(
  '/releases/:id',
  requirePermission(PERMISSIONS.RELEASE_MANAGE),
  validate(updateReleaseSchema),
  (req, res, next) => releasesController.update(req, res, next)
);

router.post(
  '/releases/:id/bugs',
  requirePermission(PERMISSIONS.RELEASE_MANAGE),
  validate(linkBugsSchema),
  (req, res, next) => releasesController.linkBugs(req, res, next)
);

router.delete('/releases/:id/bugs/:bugId', requirePermission(PERMISSIONS.RELEASE_MANAGE), (req, res, next) =>
  releasesController.unlinkBug(req, res, next)
);

router.patch('/releases/:id/publish', requirePermission(PERMISSIONS.RELEASE_MANAGE), (req, res, next) =>
  releasesController.publish(req, res, next)
);

export default router;
