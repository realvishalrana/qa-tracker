import { AppError } from '../../common/AppError';
import { notificationsRepository } from './notifications.repository';

export class NotificationsService {
  async list(userId: string, page = 1, limit = 20) {
    const [items, total] = await notificationsRepository.list(userId, (page - 1) * limit, limit);
    return { items, total, page, limit };
  }

  unreadCount(userId: string) {
    return notificationsRepository.unreadCount(userId);
  }

  async markRead(id: string, userId: string) {
    const result = await notificationsRepository.markRead(id, userId);
    if (result.count === 0) throw new AppError('Notification not found', 404);
    return { message: 'Marked as read' };
  }

  markAllRead(userId: string) {
    return notificationsRepository.markAllRead(userId);
  }
}

export const notificationsService = new NotificationsService();
