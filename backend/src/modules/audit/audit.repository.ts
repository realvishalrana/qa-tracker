import { prisma } from '../../database/prisma';

export class AuditRepository {
  findMany(params: {
    where: Record<string, unknown>;
    skip: number;
    take: number;
  }) {
    return Promise.all([
      prisma.auditLog.findMany({
        where: params.where,
        include: { actor: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        skip: params.skip,
        take: params.take,
      }),
      prisma.auditLog.count({ where: params.where }),
    ]);
  }
}

export const auditRepository = new AuditRepository();
