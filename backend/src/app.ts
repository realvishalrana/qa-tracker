import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { config } from './config';
import { errorMiddleware, notFoundMiddleware } from './middlewares/error.middleware';
import { authMiddleware } from './middlewares/auth.middleware';
import { requirePermission } from './middlewares/rbac.middleware';
import { validate } from './middlewares/validate.middleware';
import { auditLogger } from './middlewares/audit.middleware';
import { swaggerSpec } from './swagger';
import { sendSuccess } from './common/response';
import { PERMISSIONS } from './common/permissions';

import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import rolesRoutes from './modules/roles/roles.routes';
import projectsRoutes from './modules/projects/projects.routes';
import featuresRoutes from './modules/features/features.routes';
import bugsRoutes from './modules/bugs/bugs.routes';
import { createBugSchema } from './modules/bugs/bugs.dto';
import { bugsController } from './modules/bugs/bugs.controller';
import commentsRoutes from './modules/comments/comments.routes';
import attachmentsRoutes from './modules/attachments/attachments.routes';
import notificationsRoutes from './modules/notifications/notifications.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import reportsRoutes from './modules/reports/reports.routes';
import releasesRoutes from './modules/releases/releases.routes';
import auditRoutes from './modules/audit/audit.routes';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: config.frontendUrl,
      credentials: true,
    })
  );
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use('/uploads', express.static(path.resolve(process.cwd(), config.uploadDir)));

  app.get('/api/v1/health', (_req, res) => sendSuccess(res, { status: 'ok' }));
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', usersRoutes);
  app.use('/api/v1/roles', rolesRoutes);
  app.use('/api/v1/projects', projectsRoutes);
  app.use('/api/v1', featuresRoutes);

  app.post(
    '/api/v1/projects/:projectId/bugs',
    authMiddleware,
    requirePermission(PERMISSIONS.BUG_CREATE),
    validate(createBugSchema),
    auditLogger('CREATE_BUG', 'Bug'),
    (req, res, next) => bugsController.create(req, res, next)
  );
  app.use('/api/v1/bugs', bugsRoutes);
  app.use('/api/v1', commentsRoutes);
  app.use('/api/v1', attachmentsRoutes);
  app.use('/api/v1/notifications', notificationsRoutes);
  app.use('/api/v1/dashboard', dashboardRoutes);
  app.use('/api/v1/reports', reportsRoutes);
  app.use('/api/v1', releasesRoutes);
  app.use('/api/v1/audit-logs', auditRoutes);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
