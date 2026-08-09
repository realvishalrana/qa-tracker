import { AppError } from '../../common/AppError';
import { PERMISSIONS } from '../../common/permissions';
import { AuthUser } from '../../common/types';
import { hasPermission, isAdmin } from '../../middlewares/rbac.middleware';
import { bugsService } from '../bugs/bugs.service';
import { attachmentsRepository } from './attachments.repository';

export class AttachmentsService {
  async list(bugId: string, user: AuthUser) {
    await bugsService.getById(bugId, user);
    return attachmentsRepository.findByBug(bugId);
  }

  async create(bugId: string, user: AuthUser, file?: Express.Multer.File) {
    if (!hasPermission(user, PERMISSIONS.ATTACHMENT_UPLOAD)) {
      throw new AppError('Insufficient permissions', 403);
    }
    if (!file) throw new AppError('File is required', 400);
    await bugsService.getById(bugId, user);

    return attachmentsRepository.create({
      bugId,
      uploaderId: user.id,
      fileName: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
    });
  }

  async getForDownload(id: string, user: AuthUser) {
    const attachment = await attachmentsRepository.findById(id);
    if (!attachment) throw new AppError('Attachment not found', 404);
    await bugsService.getById(attachment.bugId, user);
    return attachment;
  }

  async remove(id: string, user: AuthUser) {
    const attachment = await attachmentsRepository.findById(id);
    if (!attachment) throw new AppError('Attachment not found', 404);
    await bugsService.getById(attachment.bugId, user);
    const canManage =
      attachment.uploaderId === user.id ||
      isAdmin(user) ||
      hasPermission(user, PERMISSIONS.PROJECT_MEMBERS_MANAGE);
    if (!canManage) {
      throw new AppError('Cannot delete this attachment', 403);
    }
    return attachmentsRepository.softDelete(id);
  }
}

export const attachmentsService = new AttachmentsService();
