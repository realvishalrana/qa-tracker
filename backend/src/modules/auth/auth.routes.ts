import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { changePasswordSchema, loginSchema, registerSchema } from './auth.dto';
import { auditLogger } from '../../middlewares/audit.middleware';

const router = Router();

router.post('/register', validate(registerSchema), auditLogger('REGISTER', 'User'), (req, res, next) =>
  authController.register(req, res, next)
);
router.post('/login', validate(loginSchema), auditLogger('LOGIN', 'User'), (req, res, next) =>
  authController.login(req, res, next)
);
router.post('/logout', authMiddleware, (req, res, next) => authController.logout(req, res, next));
router.get('/me', authMiddleware, (req, res, next) => authController.me(req, res, next));
router.post(
  '/change-password',
  authMiddleware,
  validate(changePasswordSchema),
  (req, res, next) => authController.changePassword(req, res, next)
);

export default router;
