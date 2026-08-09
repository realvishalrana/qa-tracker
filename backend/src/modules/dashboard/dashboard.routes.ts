import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { dashboardController } from './dashboard.controller';

const router = Router();
router.use(authMiddleware);

router.get('/summary', (req, res, next) => dashboardController.summary(req, res, next));
router.get('/charts', (req, res, next) => dashboardController.charts(req, res, next));
router.get('/my-work', (req, res, next) => dashboardController.myWork(req, res, next));

export default router;
