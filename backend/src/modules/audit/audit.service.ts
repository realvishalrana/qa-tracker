import { auditRepository } from './audit.repository';

export class AuditService {
  async list(query: {
    page?: number;
    limit?: number;
    actorId?: string;
    action?: string;
    entityType?: string;
    from?: string;
    to?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 50;
    const where = {
      ...(query.actorId ? { actorId: query.actorId } : {}),
      ...(query.action ? { action: query.action } : {}),
      ...(query.entityType ? { entityType: query.entityType } : {}),
      ...(query.from || query.to
        ? {
            createdAt: {
              ...(query.from ? { gte: new Date(query.from) } : {}),
              ...(query.to ? { lte: new Date(query.to) } : {}),
            },
          }
        : {}),
    };

    const [items, total] = await auditRepository.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit };
  }
}

export const auditService = new AuditService();
