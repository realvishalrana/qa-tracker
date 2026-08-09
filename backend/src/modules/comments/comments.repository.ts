import { prisma } from '../../database/prisma';

export class CommentsRepository {
  listByBug(bugId: string) {
    return prisma.comment.findMany({
      where: { bugId, deletedAt: null },
      include: { author: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  findById(id: string) {
    return prisma.comment.findFirst({
      where: { id, deletedAt: null },
      include: { author: { select: { id: true, name: true, email: true } }, bug: true },
    });
  }

  create(data: { bugId: string; authorId: string; body: string }) {
    return prisma.comment.create({
      data,
      include: { author: { select: { id: true, name: true, email: true } } },
    });
  }

  update(id: string, body: string) {
    return prisma.comment.update({
      where: { id },
      data: { body },
      include: { author: { select: { id: true, name: true, email: true } } },
    });
  }

  softDelete(id: string) {
    return prisma.comment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export const commentsRepository = new CommentsRepository();
