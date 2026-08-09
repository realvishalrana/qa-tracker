import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requirePermission } from '../../middlewares/rbac.middleware';
import { PERMISSIONS } from '../../common/permissions';
import { rolesController } from './roles.controller';

const router = Router();
router.use(authMiddleware);
router.use(requirePermission(PERMISSIONS.USERS_MANAGE));

router.get('/', (req, res, next) => rolesController.list(req, res, next));

export default router;
