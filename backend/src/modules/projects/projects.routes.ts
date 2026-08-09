import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requirePermission } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { auditLogger } from '../../middlewares/audit.middleware';
import { PERMISSIONS } from '../../common/permissions';
import {
  createProjectSchema,
  memberSchema,
  updateMemberSchema,
  updateProjectSchema,
} from './projects.dto';
import { projectsController } from './projects.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', (req, res, next) => projectsController.list(req, res, next));
router.post(
  '/',
  requirePermission(PERMISSIONS.PROJECT_CREATE),
  validate(createProjectSchema),
  auditLogger('CREATE_PROJECT', 'Project'),
  (req, res, next) => projectsController.create(req, res, next)
);
router.get('/:id', (req, res, next) => projectsController.getById(req, res, next));
router.patch(
  '/:id',
  requirePermission(PERMISSIONS.PROJECT_UPDATE),
  validate(updateProjectSchema),
  auditLogger('UPDATE_PROJECT', 'Project'),
  (req, res, next) => projectsController.update(req, res, next)
);
router.delete(
  '/:id',
  requirePermission(PERMISSIONS.PROJECT_DELETE),
  auditLogger('DELETE_PROJECT', 'Project'),
  (req, res, next) => projectsController.remove(req, res, next)
);
router.get('/:id/members', (req, res, next) => projectsController.listMembers(req, res, next));
router.post(
  '/:id/members',
  requirePermission(PERMISSIONS.PROJECT_MEMBERS_MANAGE),
  validate(memberSchema),
  auditLogger('ADD_MEMBER', 'ProjectMember'),
  (req, res, next) => projectsController.addMember(req, res, next)
);
router.patch(
  '/:id/members/:userId',
  requirePermission(PERMISSIONS.PROJECT_MEMBERS_MANAGE),
  validate(updateMemberSchema),
  (req, res, next) => projectsController.updateMember(req, res, next)
);
router.delete(
  '/:id/members/:userId',
  requirePermission(PERMISSIONS.PROJECT_MEMBERS_MANAGE),
  (req, res, next) => projectsController.removeMember(req, res, next)
);
router.get('/:id/activity', (req, res, next) => projectsController.activity(req, res, next));

export default router;
