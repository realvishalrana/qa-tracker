import { Prisma, ProjectRole, ProjectStatus } from '@prisma/client';
import { prisma } from '../../database/prisma';

const memberUserSelect = {
  id: true,
  name: true,
  email: true,
  roles: { include: { role: { select: { id: true, name: true } } } },
} as const;

export class ProjectsRepository {
  findAccessible(userId: string, isAdmin: boolean) {
    const where: Prisma.ProjectWhereInput = {
      deletedAt: null,
      ...(isAdmin
        ? {}
        : {
            members: { some: { userId } },
          }),
    };
    return prisma.project.findMany({
      where,
      include: {
        _count: { select: { bugs: true, members: true, features: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string) {
    return prisma.project.findFirst({
      where: { id, deletedAt: null },
      include: {
        _count: { select: { bugs: true, members: true, features: true } },
      },
    });
  }

  findByKey(key: string) {
    return prisma.project.findFirst({ where: { key, deletedAt: null } });
  }

  create(data: { name: string; key: string; description?: string }) {
    return prisma.project.create({ data });
  }

  update(id: string, data: { name?: string; description?: string; status?: ProjectStatus }) {
    return prisma.project.update({ where: { id }, data });
  }

  softDelete(id: string) {
    return prisma.project.update({
      where: { id },
      data: { deletedAt: new Date(), status: ProjectStatus.ARCHIVED },
    });
  }

  addMember(projectId: string, userId: string, projectRole: ProjectRole) {
    return prisma.projectMember.create({
      data: { projectId, userId, projectRole },
      include: { user: { select: memberUserSelect } },
    });
  }

  updateMember(projectId: string, userId: string, projectRole: ProjectRole) {
    return prisma.projectMember.update({
      where: { projectId_userId: { projectId, userId } },
      data: { projectRole },
      include: { user: { select: memberUserSelect } },
    });
  }

  removeMember(projectId: string, userId: string) {
    return prisma.projectMember.delete({
      where: { projectId_userId: { projectId, userId } },
    });
  }

  listMembers(projectId: string) {
    return prisma.projectMember.findMany({
      where: { projectId },
      include: { user: { select: memberUserSelect } },
    });
  }

  findMembership(projectId: string, userId: string) {
    return prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });
  }

  listActivity(projectId: string, take = 50) {
    return prisma.bugHistory.findMany({
      where: { bug: { projectId, deletedAt: null } },
      include: {
        actor: { select: { id: true, name: true, email: true } },
        bug: { select: { id: true, bugKey: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take,
    });
  }
}

export const projectsRepository = new ProjectsRepository();
