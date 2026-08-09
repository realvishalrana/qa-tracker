import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createCommentSchema, updateCommentSchema } from './comments.dto';
import { commentsController } from './comments.controller';

const router = Router();
router.use(authMiddleware);

router.get('/bugs/:bugId/comments', (req, res, next) => commentsController.list(req, res, next));
router.post(
  '/bugs/:bugId/comments',
  validate(createCommentSchema),
  (req, res, next) => commentsController.create(req, res, next)
);
router.patch('/comments/:id', validate(updateCommentSchema), (req, res, next) =>
  commentsController.update(req, res, next)
);
router.delete('/comments/:id', (req, res, next) => commentsController.remove(req, res, next));

export default router;
