import { BugStatus } from '@prisma/client';
import { AuthUser } from '../../common/types';
import { isAdmin } from '../../middlewares/rbac.middleware';
import { dashboardRepository } from './dashboard.repository';

export class DashboardService {
  private async projectFilter(user: AuthUser) {
    if (isAdmin(user)) return {};
    const memberships = await dashboardRepository.findMembershipProjectIds(user.id);
    return { projectId: { in: memberships.map((m) => m.projectId) } };
  }

  async summary(user: AuthUser) {
    const scope = await this.projectFilter(user);
    const base = { deletedAt: null, ...scope };

    const [byStatus, bySeverity, myOpen, total] = await Promise.all([
      dashboardRepository.groupBugsByStatus(base),
      dashboardRepository.groupBugsBySeverity(base),
      dashboardRepository.countBugs({
        ...base,
        assigneeId: user.id,
        status: { notIn: [BugStatus.CLOSED, BugStatus.VERIFIED] },
      }),
      dashboardRepository.countBugs(base),
    ]);

    return {
      total,
      myOpen,
      byStatus: byStatus.map((s) => ({ status: s.status, count: s._count._all })),
      bySeverity: bySeverity.map((s) => ({ severity: s.severity, count: s._count._all })),
    };
  }

  async charts(user: AuthUser) {
    const summary = await this.summary(user);
    const scope = await this.projectFilter(user);
    const recent = await dashboardRepository.findRecentBugs({ deletedAt: null, ...scope });

    const byDay: Record<string, { opened: number; closed: number }> = {};
    for (const bug of recent) {
      const day = bug.createdAt.toISOString().slice(0, 10);
      byDay[day] = byDay[day] || { opened: 0, closed: 0 };
      byDay[day].opened += 1;
      if (bug.resolvedAt) {
        const rday = bug.resolvedAt.toISOString().slice(0, 10);
        byDay[rday] = byDay[rday] || { opened: 0, closed: 0 };
        byDay[rday].closed += 1;
      }
    }

    return {
      severity: summary.bySeverity,
      status: summary.byStatus,
      timeline: Object.entries(byDay)
        .map(([date, values]) => ({ date, ...values }))
        .sort((a, b) => a.date.localeCompare(b.date)),
    };
  }

  async myWork(user: AuthUser) {
    const [assigned, reported] = await Promise.all([
      dashboardRepository.findAssignedBugs(user.id),
      dashboardRepository.findReportedBugs(user.id),
    ]);
    return { assigned, reported };
  }
}

export const dashboardService = new DashboardService();
