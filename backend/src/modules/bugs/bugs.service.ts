import {
  BugStatus,
  IssueType,
  Priority,
  Severity,
} from '@prisma/client';
import { AppError } from '../../common/AppError';
import { STATUS_TRANSITIONS } from '../../common/constants';
import { PERMISSIONS } from '../../common/permissions';
import { AuthUser } from '../../common/types';
import { hasPermission, isAdmin } from '../../middlewares/rbac.middleware';
import { projectsService } from '../projects/projects.service';
import { notificationsRepository } from '../notifications/notifications.repository';
import { BugFilters, bugsRepository } from './bugs.repository';

export class BugsService {
  private async scopeFilters(user: AuthUser, filters: BugFilters): Promise<BugFilters> {
    if (isAdmin(user)) {
      return { ...filters, isAdmin: true };
    }
    const memberships = await bugsRepository.getAccessibleProjectIds(user.id);
    return {
      ...filters,
      isAdmin: false,
      accessibleProjectIds: memberships.map((m) => m.projectId),
    };
  }

  async list(user: AuthUser, raw: Record<string, string | undefined>) {
    const page = Number(raw.page || 1);
    const limit = Number(raw.limit || 20);
    const filters = await this.scopeFilters(user, {
      q: raw.q,
      projectId: raw.projectId,
      featureId: raw.featureId,
      status: raw.status as BugStatus | undefined,
      severity: raw.severity as Severity | undefined,
      priority: raw.priority as Priority | undefined,
      issueType: raw.issueType as IssueType | undefined,
      assigneeId: raw.assigneeId,
      reporterId: raw.reporterId,
      releaseId: raw.releaseId,
      environment: raw.environment,
      buildVersion: raw.buildVersion,
      from: raw.from,
      to: raw.to,
    });
    const { items, total } = await bugsRepository.list(
      filters,
      (page - 1) * limit,
      limit,
      raw.sort || 'createdAt:desc'
    );
    return { items, total, page, limit };
  }

  async getById(id: string, user: AuthUser) {
    const bug = await bugsRepository.findById(id);
    if (!bug) throw new AppError('Bug not found', 404);
    await projectsService.ensureAccess(bug.projectId, user);
    return bug;
  }

  async create(
    projectId: string,
    data: {
      title: string;
      description?: string;
      featureId?: string | null;
      issueType: IssueType;
      severity: Severity;
      priority: Priority;
      expectedResult?: string;
      actualResult?: string;
      reproductionSteps?: string;
      environment?: string;
      buildVersion?: string;
      assigneeId?: string | null;
    },
    user: AuthUser
  ) {
    await projectsService.ensureAccess(projectId, user);
    if (!hasPermission(user, PERMISSIONS.BUG_CREATE)) {
      throw new AppError('Insufficient permissions', 403);
    }

    const bug = await bugsRepository.createWithKey(projectId, {
      title: data.title,
      description: data.description,
      featureId: data.featureId || null,
      issueType: data.issueType,
      severity: data.severity,
      priority: data.priority,
      expectedResult: data.expectedResult,
      actualResult: data.actualResult,
      reproductionSteps: data.reproductionSteps,
      environment: data.environment,
      buildVersion: data.buildVersion,
      assigneeId: data.assigneeId || null,
      reporterId: user.id,
      status: BugStatus.NEW,
    });

    await bugsRepository.addHistory({
      bugId: bug.id,
      actorId: user.id,
      field: 'created',
      newValue: bug.bugKey,
    });

    if (bug.assigneeId) {
      await notificationsRepository.create({
        userId: bug.assigneeId,
        title: 'Bug assigned',
        message: `You were assigned ${bug.bugKey}: ${bug.title}`,
        link: `/bugs/${bug.id}`,
      });
    }

    return bug;
  }

  async update(id: string, data: Record<string, unknown>, user: AuthUser) {
    const bug = await this.getById(id, user);
    if (!hasPermission(user, PERMISSIONS.BUG_UPDATE)) {
      throw new AppError('Insufficient permissions', 403);
    }

    const tracked = [
      'title',
      'description',
      'featureId',
      'issueType',
      'severity',
      'priority',
      'expectedResult',
      'actualResult',
      'reproductionSteps',
      'environment',
      'buildVersion',
      'assigneeId',
    ] as const;

    const bugRecord = bug as unknown as Record<string, unknown>;
    for (const field of tracked) {
      if (data[field] !== undefined && String(bugRecord[field] ?? '') !== String(data[field] ?? '')) {
        await bugsRepository.addHistory({
          bugId: bug.id,
          actorId: user.id,
          field,
          oldValue: String(bugRecord[field] ?? ''),
          newValue: String(data[field] ?? ''),
        });
      }
    }

    const { assigneeId, featureId, ...rest } = data as {
      assigneeId?: string | null;
      featureId?: string | null;
      [key: string]: unknown;
    };

    const updated = await bugsRepository.update(id, {
      ...rest,
      ...(featureId !== undefined
        ? { feature: featureId ? { connect: { id: featureId } } : { disconnect: true } }
        : {}),
      ...(assigneeId !== undefined
        ? { assignee: assigneeId ? { connect: { id: assigneeId } } : { disconnect: true } }
        : {}),
    });

    if (data.assigneeId && data.assigneeId !== bug.assigneeId && typeof data.assigneeId === 'string') {
      await notificationsRepository.create({
        userId: data.assigneeId,
        title: 'Bug assigned',
        message: `You were assigned ${updated.bugKey}: ${updated.title}`,
        link: `/bugs/${updated.id}`,
      });
    }

    return updated;
  }

  async updateStatus(id: string, status: BugStatus, user: AuthUser) {
    const bug = await this.getById(id, user);
    if (!hasPermission(user, PERMISSIONS.BUG_STATUS)) {
      throw new AppError('Insufficient permissions', 403);
    }

    const allowed = STATUS_TRANSITIONS[bug.status] || [];
    if (!allowed.includes(status)) {
      const allowedList = allowed.length ? allowed.join(', ') : 'none';
      throw new AppError(
        `Cannot change status from ${bug.status} to ${status}. From ${bug.status} you can move to: ${allowedList}.`,
        400
      );
    }

    await bugsRepository.addHistory({
      bugId: bug.id,
      actorId: user.id,
      field: 'status',
      oldValue: bug.status,
      newValue: status,
    });

    const updated = await bugsRepository.update(id, {
      status,
      ...(status === BugStatus.RESOLVED || status === BugStatus.CLOSED
        ? { resolvedAt: new Date() }
        : {}),
      ...(status === BugStatus.REOPENED ? { resolvedAt: null } : {}),
    });

    const notifyUserId = updated.assigneeId || updated.reporterId;
    if (notifyUserId && notifyUserId !== user.id) {
      await notificationsRepository.create({
        userId: notifyUserId,
        title: 'Bug status updated',
        message: `${updated.bugKey} moved to ${status}`,
        link: `/bugs/${updated.id}`,
      });
    }

    return updated;
  }

  async assign(id: string, assigneeId: string | null, user: AuthUser) {
    const bug = await this.getById(id, user);
    await bugsRepository.addHistory({
      bugId: bug.id,
      actorId: user.id,
      field: 'assigneeId',
      oldValue: bug.assigneeId,
      newValue: assigneeId,
    });
    const updated = await bugsRepository.update(id, {
      assignee: assigneeId ? { connect: { id: assigneeId } } : { disconnect: true },
    });
    if (assigneeId) {
      await notificationsRepository.create({
        userId: assigneeId,
        title: 'Bug assigned',
        message: `You were assigned ${updated.bugKey}: ${updated.title}`,
        link: `/bugs/${updated.id}`,
      });
    }
    return updated;
  }

  async remove(id: string, user: AuthUser) {
    const bug = await this.getById(id, user);
    return bugsRepository.softDelete(bug.id);
  }

  async history(id: string, user: AuthUser) {
    await this.getById(id, user);
    return bugsRepository.listHistory(id);
  }

  async timeline(id: string, user: AuthUser) {
    await this.getById(id, user);
    return bugsRepository.timeline(id);
  }
}

export const bugsService = new BugsService();
