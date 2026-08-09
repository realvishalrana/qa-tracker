import { prisma } from '../../database/prisma';

export class FeaturesRepository {
  listByProject(projectId: string) {
    return prisma.feature.findMany({
      where: { projectId, deletedAt: null },
      include: { _count: { select: { bugs: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string) {
    return prisma.feature.findFirst({
      where: { id, deletedAt: null },
      include: { _count: { select: { bugs: true } }, project: true },
    });
  }

  create(data: { projectId: string; name: string; description?: string }) {
    return prisma.feature.create({ data });
  }

  update(id: string, data: { name?: string; description?: string }) {
    return prisma.feature.update({ where: { id }, data });
  }

  softDelete(id: string) {
    return prisma.feature.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export const featuresRepository = new FeaturesRepository();
