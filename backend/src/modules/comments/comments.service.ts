import { AppError } from '../../common/AppError';
import { PERMISSIONS } from '../../common/permissions';
import { AuthUser } from '../../common/types';
import { hasPermission, isAdmin } from '../../middlewares/rbac.middleware';
import { bugsService } from '../bugs/bugs.service';
import { notificationsRepository } from '../notifications/notifications.repository';
import { commentsRepository } from './comments.repository';

export class CommentsService {
  async list(bugId: string, user: AuthUser) {
    await bugsService.getById(bugId, user);
    return commentsRepository.listByBug(bugId);
  }

  async create(bugId: string, body: string, user: AuthUser) {
    if (!hasPermission(user, PERMISSIONS.COMMENT_CREATE)) {
      throw new AppError('Insufficient permissions', 403);
    }
    const bug = await bugsService.getById(bugId, user);
    const comment = await commentsRepository.create({ bugId, authorId: user.id, body });

    const targets = new Set<string>();
    if (bug.reporterId !== user.id) targets.add(bug.reporterId);
    if (bug.assigneeId && bug.assigneeId !== user.id) targets.add(bug.assigneeId);
    await Promise.all(
      [...targets].map((userId) =>
        notificationsRepository.create({
          userId,
          title: 'New comment',
          message: `${user.name} commented on ${bug.bugKey}`,
          link: `/bugs/${bug.id}`,
        })
      )
    );

    return comment;
  }

  async update(id: string, body: string, user: AuthUser) {
    const comment = await commentsRepository.findById(id);
    if (!comment) throw new AppError('Comment not found', 404);
    await bugsService.getById(comment.bugId, user);
    if (comment.authorId !== user.id && !isAdmin(user)) {
      throw new AppError('Cannot edit this comment', 403);
    }
    return commentsRepository.update(id, body);
  }

  async remove(id: string, user: AuthUser) {
    const comment = await commentsRepository.findById(id);
    if (!comment) throw new AppError('Comment not found', 404);
    await bugsService.getById(comment.bugId, user);
    if (comment.authorId !== user.id && !isAdmin(user)) {
      throw new AppError('Cannot delete this comment', 403);
    }
    return commentsRepository.softDelete(id);
  }
}

export const commentsService = new CommentsService();
