import { ReleaseStatus } from '@prisma/client';
import { prisma } from '../../database/prisma';

export class ReleasesRepository {
  findByProject(projectId: string) {
    return prisma.release.findMany({
      where: { projectId, deletedAt: null },
      include: { _count: { select: { bugs: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string) {
    return prisma.release.findFirst({
      where: { id, deletedAt: null },
      include: {
        bugs: {
          where: { deletedAt: null },
          include: {
            assignee: { select: { id: true, name: true } },
            reporter: { select: { id: true, name: true } },
          },
        },
        project: { select: { id: true, name: true, key: true } },
      },
    });
  }

  create(data: { projectId: string; name: string; version: string; notes?: string }) {
    return prisma.release.create({ data });
  }

  update(id: string, data: { name?: string; notes?: string; status?: ReleaseStatus; releasedAt?: Date }) {
    return prisma.release.update({ where: { id }, data });
  }

  linkBugs(releaseId: string, projectId: string, bugIds: string[]) {
    return prisma.bug.updateMany({
      where: { id: { in: bugIds }, projectId },
      data: { releaseId },
    });
  }

  unlinkBug(releaseId: string, bugId: string) {
    return prisma.bug.updateMany({
      where: { id: bugId, releaseId },
      data: { releaseId: null },
    });
  }

  findBugsForNotify(bugIds: string[]) {
    return prisma.bug.findMany({
      where: { id: { in: bugIds } },
      select: { assigneeId: true, bugKey: true },
    });
  }
}

export const releasesRepository = new ReleasesRepository();
