import { AppError } from '../../common/AppError';
import { PERMISSIONS } from '../../common/permissions';
import { AuthUser } from '../../common/types';
import { hasPermission, isAdmin } from '../../middlewares/rbac.middleware';
import { reportsRepository } from './reports.repository';

export class ReportsService {
  private async scope(user: AuthUser) {
    if (isAdmin(user)) return { deletedAt: null };
    const memberships = await reportsRepository.findMembershipProjectIds(user.id);
    return { deletedAt: null, projectId: { in: memberships.map((m) => m.projectId) } };
  }

  async byStatus(user: AuthUser) {
    if (!hasPermission(user, PERMISSIONS.REPORTS_READ)) {
      throw new AppError('Insufficient permissions', 403);
    }
    const where = await this.scope(user);
    const rows = await reportsRepository.groupBugsByStatus(where);
    return rows.map((r) => ({ status: r.status, count: r._count._all }));
  }

  async bySeverity(user: AuthUser) {
    if (!hasPermission(user, PERMISSIONS.REPORTS_READ)) {
      throw new AppError('Insufficient permissions', 403);
    }
    const where = await this.scope(user);
    const rows = await reportsRepository.groupBugsBySeverity(where);
    return rows.map((r) => ({ severity: r.severity, count: r._count._all }));
  }

  async byAssignee(user: AuthUser) {
    if (!hasPermission(user, PERMISSIONS.REPORTS_READ)) {
      throw new AppError('Insufficient permissions', 403);
    }
    const where = await this.scope(user);
    const rows = await reportsRepository.groupBugsByAssignee(where);
    const ids = rows.map((r) => r.assigneeId).filter(Boolean) as string[];
    const users = await reportsRepository.findUsersByIds(ids);
    const map = Object.fromEntries(users.map((u) => [u.id, u]));
    return rows.map((r) => ({
      assigneeId: r.assigneeId,
      assignee: r.assigneeId ? map[r.assigneeId] : null,
      count: r._count._all,
    }));
  }

  async resolutionTime(user: AuthUser) {
    if (!hasPermission(user, PERMISSIONS.REPORTS_READ)) {
      throw new AppError('Insufficient permissions', 403);
    }
    const where = await this.scope(user);
    const bugs = await reportsRepository.findResolvedBugs(where);
    if (!bugs.length) return { averageHours: 0, sampleSize: 0 };
    const totalMs = bugs.reduce(
      (sum, b) => sum + (b.resolvedAt!.getTime() - b.createdAt.getTime()),
      0
    );
    return {
      averageHours: Number((totalMs / bugs.length / 36e5).toFixed(2)),
      sampleSize: bugs.length,
    };
  }

  async export(user: AuthUser, type = 'json') {
    if (!hasPermission(user, PERMISSIONS.REPORTS_EXPORT)) {
      throw new AppError('Insufficient permissions', 403);
    }
    const where = await this.scope(user);
    const bugs = await reportsRepository.findBugsForExport(where);

    if (type === 'csv') {
      const header = [
        'bugKey',
        'title',
        'status',
        'severity',
        'priority',
        'issueType',
        'project',
        'reporter',
        'assignee',
        'createdAt',
      ];
      const lines = bugs.map((b) =>
        [
          b.bugKey,
          JSON.stringify(b.title),
          b.status,
          b.severity,
          b.priority,
          b.issueType,
          b.project.key,
          b.reporter.email,
          b.assignee?.email || '',
          b.createdAt.toISOString(),
        ].join(',')
      );
      return { format: 'csv' as const, content: [header.join(','), ...lines].join('\n') };
    }

    return { format: 'json' as const, content: bugs };
  }
}

export const reportsService = new ReportsService();
