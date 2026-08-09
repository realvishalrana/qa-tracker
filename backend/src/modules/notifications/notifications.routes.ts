import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { listNotificationsSchema, notificationIdSchema } from './notifications.dto';
import { notificationsController } from './notifications.controller';

const router = Router();
router.use(authMiddleware);

router.get('/', validate(listNotificationsSchema), (req, res, next) =>
  notificationsController.list(req, res, next)
);
router.get('/unread-count', (req, res, next) => notificationsController.unreadCount(req, res, next));
router.patch('/:id/read', validate(notificationIdSchema), (req, res, next) =>
  notificationsController.markRead(req, res, next)
);
router.post('/read-all', (req, res, next) => notificationsController.markAllRead(req, res, next));

export default router;
