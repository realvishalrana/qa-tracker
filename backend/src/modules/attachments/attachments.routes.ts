import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { attachmentsController } from './attachments.controller';
import { upload } from './attachments.upload';

const router = Router();
router.use(authMiddleware);

router.get('/bugs/:bugId/attachments', (req, res, next) =>
  attachmentsController.list(req, res, next)
);
router.post('/bugs/:bugId/attachments', upload.single('file'), (req, res, next) =>
  attachmentsController.create(req, res, next)
);
router.get('/attachments/:id/download', (req, res, next) =>
  attachmentsController.download(req, res, next)
);
router.delete('/attachments/:id', (req, res, next) =>
  attachmentsController.remove(req, res, next)
);

export default router;
