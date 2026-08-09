import { prisma } from '../../database/prisma';

export class NotificationsRepository {
  create(data: { userId: string; title: string; message: string; link?: string }) {
    return prisma.notification.create({ data });
  }

  list(userId: string, skip: number, take: number) {
    return Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: [{ isRead: 'asc' }, { createdAt: 'desc' }],
        skip,
        take,
      }),
      prisma.notification.count({ where: { userId } }),
    ]);
  }

  unreadCount(userId: string) {
    return prisma.notification.count({ where: { userId, isRead: false } });
  }

  markRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  markAllRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}

export const notificationsRepository = new NotificationsRepository();
