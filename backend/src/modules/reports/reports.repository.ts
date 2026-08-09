import { prisma } from '../../database/prisma';

export class ReportsRepository {
  findMembershipProjectIds(userId: string) {
    return prisma.projectMember.findMany({
      where: { userId },
      select: { projectId: true },
    });
  }

  groupBugsByStatus(where: Record<string, unknown>) {
    return prisma.bug.groupBy({ by: ['status'], where, _count: { _all: true } });
  }

  groupBugsBySeverity(where: Record<string, unknown>) {
    return prisma.bug.groupBy({ by: ['severity'], where, _count: { _all: true } });
  }

  groupBugsByAssignee(where: Record<string, unknown>) {
    return prisma.bug.groupBy({ by: ['assigneeId'], where, _count: { _all: true } });
  }

  findUsersByIds(ids: string[]) {
    return prisma.user.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true, email: true },
    });
  }

  findResolvedBugs(where: Record<string, unknown>) {
    return prisma.bug.findMany({
      where: { ...where, resolvedAt: { not: null } },
      select: { createdAt: true, resolvedAt: true },
    });
  }

  findBugsForExport(where: Record<string, unknown>) {
    return prisma.bug.findMany({
      where,
      include: {
        project: { select: { key: true, name: true } },
        reporter: { select: { name: true, email: true } },
        assignee: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const reportsRepository = new ReportsRepository();
