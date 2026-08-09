import { prisma } from '../../database/prisma';

export class AttachmentsRepository {
  findByBug(bugId: string) {
    return prisma.attachment.findMany({
      where: { bugId, deletedAt: null },
      include: { uploader: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(data: {
    bugId: string;
    uploaderId: string;
    fileName: string;
    originalName: string;
    mimeType: string;
    size: number;
    path: string;
  }) {
    return prisma.attachment.create({
      data,
      include: { uploader: { select: { id: true, name: true, email: true } } },
    });
  }

  findById(id: string) {
    return prisma.attachment.findFirst({
      where: { id, deletedAt: null },
      include: { bug: true },
    });
  }

  softDelete(id: string) {
    return prisma.attachment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export const attachmentsRepository = new AttachmentsRepository();
