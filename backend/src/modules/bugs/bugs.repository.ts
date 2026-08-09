import {
  BugStatus,
  IssueType,
  Priority,
  Prisma,
  Severity,
} from '@prisma/client';
import { prisma } from '../../database/prisma';

const bugInclude = {
  project: { select: { id: true, name: true, key: true } },
  feature: { select: { id: true, name: true } },
  reporter: { select: { id: true, name: true, email: true } },
  assignee: { select: { id: true, name: true, email: true } },
  release: { select: { id: true, name: true, version: true } },
  _count: { select: { comments: true, attachments: true } },
} satisfies Prisma.BugInclude;

export type BugFilters = {
  q?: string;
  projectId?: string;
  featureId?: string;
  status?: BugStatus;
  severity?: Severity;
  priority?: Priority;
  issueType?: IssueType;
  assigneeId?: string;
  reporterId?: string;
  releaseId?: string;
  environment?: string;
  buildVersion?: string;
  from?: string;
  to?: string;
  accessibleProjectIds?: string[];
  isAdmin?: boolean;
};

export class BugsRepository {
  private buildWhere(filters: BugFilters): Prisma.BugWhereInput {
    return {
      deletedAt: null,
      ...(filters.isAdmin
        ? {}
        : filters.accessibleProjectIds
          ? { projectId: { in: filters.accessibleProjectIds } }
          : {}),
      ...(filters.projectId ? { projectId: filters.projectId } : {}),
      ...(filters.featureId ? { featureId: filters.featureId } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.severity ? { severity: filters.severity } : {}),
      ...(filters.priority ? { priority: filters.priority } : {}),
      ...(filters.issueType ? { issueType: filters.issueType } : {}),
      ...(filters.assigneeId ? { assigneeId: filters.assigneeId } : {}),
      ...(filters.reporterId ? { reporterId: filters.reporterId } : {}),
      ...(filters.releaseId ? { releaseId: filters.releaseId } : {}),
      ...(filters.environment ? { environment: { contains: filters.environment } } : {}),
      ...(filters.buildVersion ? { buildVersion: { contains: filters.buildVersion } } : {}),
      ...(filters.from || filters.to
        ? {
            createdAt: {
              ...(filters.from ? { gte: new Date(filters.from) } : {}),
              ...(filters.to ? { lte: new Date(filters.to) } : {}),
            },
          }
        : {}),
      ...(filters.q
        ? {
            OR: [
              { title: { contains: filters.q } },
              { bugKey: { contains: filters.q } },
              { description: { contains: filters.q } },
            ],
          }
        : {}),
    };
  }

  async list(filters: BugFilters, skip: number, take: number, sort = 'createdAt:desc') {
    const [field, direction] = sort.split(':');
    const orderBy = { [field || 'createdAt']: (direction === 'asc' ? 'asc' : 'desc') } as Prisma.BugOrderByWithRelationInput;
    const where = this.buildWhere(filters);
    const [items, total] = await Promise.all([
      prisma.bug.findMany({ where, include: bugInclude, skip, take, orderBy }),
      prisma.bug.count({ where }),
    ]);
    return { items, total };
  }

  findById(id: string) {
    return prisma.bug.findFirst({
      where: { id, deletedAt: null },
      include: {
        ...bugInclude,
        history: {
          include: { actor: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });
  }

  async createWithKey(
    projectId: string,
    data: Omit<Prisma.BugUncheckedCreateInput, 'bugKey' | 'projectId'>
  ) {
    return prisma.$transaction(async (tx) => {
      const project = await tx.project.update({
        where: { id: projectId },
        data: { bugSeq: { increment: 1 } },
      });
      const bugKey = `BUG-${project.key}-${project.bugSeq}`;
      return tx.bug.create({
        data: { ...data, projectId, bugKey },
        include: bugInclude,
      });
    });
  }

  update(id: string, data: Prisma.BugUpdateInput) {
    return prisma.bug.update({
      where: { id },
      data,
      include: bugInclude,
    });
  }

  softDelete(id: string) {
    return prisma.bug.update({
      where: { id },
      data: { deletedAt: new Date() },
      include: bugInclude,
    });
  }

  addHistory(data: {
    bugId: string;
    actorId: string;
    field: string;
    oldValue?: string | null;
    newValue?: string | null;
  }) {
    return prisma.bugHistory.create({ data });
  }

  listHistory(bugId: string) {
    return prisma.bugHistory.findMany({
      where: { bugId },
      include: { actor: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async timeline(bugId: string) {
    const [history, comments, attachments] = await Promise.all([
      prisma.bugHistory.findMany({
        where: { bugId },
        include: { actor: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.comment.findMany({
        where: { bugId, deletedAt: null },
        include: { author: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.attachment.findMany({
        where: { bugId, deletedAt: null },
        include: { uploader: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const events = [
      ...history.map((h) => ({
        type: 'history' as const,
        createdAt: h.createdAt,
        data: h,
      })),
      ...comments.map((c) => ({
        type: 'comment' as const,
        createdAt: c.createdAt,
        data: c,
      })),
      ...attachments.map((a) => ({
        type: 'attachment' as const,
        createdAt: a.createdAt,
        data: a,
      })),
    ];

    return events.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getAccessibleProjectIds(userId: string) {
    return prisma.projectMember.findMany({
      where: { userId },
      select: { projectId: true },
    });
  }
}

export const bugsRepository = new BugsRepository();
