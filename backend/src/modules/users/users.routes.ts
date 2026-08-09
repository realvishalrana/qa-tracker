import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requirePermission } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { auditLogger } from '../../middlewares/audit.middleware';
import { PERMISSIONS } from '../../common/permissions';
import {
  createUserSchema,
  listUsersSchema,
  updateRolesSchema,
  updateUserSchema,
} from './users.dto';
import { usersController } from './users.controller';

const router = Router();

router.use(authMiddleware);

router.get(
  '/',
  requirePermission(PERMISSIONS.USERS_MANAGE, PERMISSIONS.PROJECT_MEMBERS_MANAGE),
  validate(listUsersSchema),
  (req, res, next) => usersController.list(req, res, next)
);
router.post(
  '/',
  requirePermission(PERMISSIONS.USERS_MANAGE),
  validate(createUserSchema),
  auditLogger('CREATE_USER', 'User'),
  (req, res, next) => usersController.create(req, res, next)
);
router.get('/:id', (req, res, next) => usersController.getById(req, res, next));
router.patch(
  '/:id',
  requirePermission(PERMISSIONS.USERS_MANAGE),
  validate(updateUserSchema),
  auditLogger('UPDATE_USER', 'User'),
  (req, res, next) => usersController.update(req, res, next)
);
router.patch(
  '/:id/roles',
  requirePermission(PERMISSIONS.USERS_MANAGE),
  validate(updateRolesSchema),
  auditLogger('UPDATE_USER_ROLES', 'User'),
  (req, res, next) => usersController.setRoles(req, res, next)
);
router.delete(
  '/:id',
  requirePermission(PERMISSIONS.USERS_MANAGE),
  auditLogger('DELETE_USER', 'User'),
  (req, res, next) => usersController.remove(req, res, next)
);

export default router;
