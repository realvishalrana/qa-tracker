import { BugStatus } from '@prisma/client';
import { prisma } from '../../database/prisma';

export class DashboardRepository {
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

  countBugs(where: Record<string, unknown>) {
    return prisma.bug.count({ where });
  }

  findRecentBugs(where: Record<string, unknown>, take = 200) {
    return prisma.bug.findMany({
      where,
      select: { createdAt: true, status: true, resolvedAt: true },
      orderBy: { createdAt: 'desc' },
      take,
    });
  }

  findAssignedBugs(userId: string, take = 50) {
    return prisma.bug.findMany({
      where: { deletedAt: null, assigneeId: userId },
      include: {
        project: { select: { id: true, key: true, name: true } },
        assignee: { select: { id: true, name: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take,
    });
  }

  findReportedBugs(userId: string, take = 50) {
    return prisma.bug.findMany({
      where: { deletedAt: null, reporterId: userId },
      include: {
        project: { select: { id: true, key: true, name: true } },
        assignee: { select: { id: true, name: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take,
    });
  }
}

export const dashboardRepository = new DashboardRepository();
