import { ReleaseStatus } from '@prisma/client';
import { AppError } from '../../common/AppError';
import { PERMISSIONS } from '../../common/permissions';
import { AuthUser } from '../../common/types';
import { hasPermission } from '../../middlewares/rbac.middleware';
import { projectsService } from '../projects/projects.service';
import { notificationsRepository } from '../notifications/notifications.repository';
import { releasesRepository } from './releases.repository';

export class ReleasesService {
  async list(projectId: string, user: AuthUser) {
    await projectsService.ensureAccess(projectId, user);
    return releasesRepository.findByProject(projectId);
  }

  async getById(id: string, user: AuthUser) {
    const release = await releasesRepository.findById(id);
    if (!release) throw new AppError('Release not found', 404);
    await projectsService.ensureAccess(release.projectId, user);
    return release;
  }

  async create(
    projectId: string,
    data: { name: string; version: string; notes?: string },
    user: AuthUser
  ) {
    await projectsService.ensureAccess(projectId, user);
    if (!hasPermission(user, PERMISSIONS.RELEASE_MANAGE)) {
      throw new AppError('Insufficient permissions', 403);
    }
    return releasesRepository.create({ projectId, ...data });
  }

  async update(
    id: string,
    data: { name?: string; notes?: string; status?: ReleaseStatus },
    user: AuthUser
  ) {
    const release = await this.getById(id, user);
    if (!hasPermission(user, PERMISSIONS.RELEASE_MANAGE)) {
      throw new AppError('Insufficient permissions', 403);
    }
    return releasesRepository.update(release.id, data);
  }

  async linkBugs(id: string, bugIds: string[], user: AuthUser) {
    const release = await this.getById(id, user);
    if (!hasPermission(user, PERMISSIONS.RELEASE_MANAGE)) {
      throw new AppError('Insufficient permissions', 403);
    }
    await releasesRepository.linkBugs(release.id, release.projectId, bugIds);

    const bugs = await releasesRepository.findBugsForNotify(bugIds);
    await Promise.all(
      bugs
        .filter((b) => b.assigneeId)
        .map((b) =>
          notificationsRepository.create({
            userId: b.assigneeId!,
            title: 'Bug linked to release',
            message: `${b.bugKey} linked to ${release.name} (${release.version})`,
            link: `/releases/${release.id}`,
          })
        )
    );

    return this.getById(id, user);
  }

  async unlinkBug(id: string, bugId: string, user: AuthUser) {
    const release = await this.getById(id, user);
    if (!hasPermission(user, PERMISSIONS.RELEASE_MANAGE)) {
      throw new AppError('Insufficient permissions', 403);
    }
    await releasesRepository.unlinkBug(release.id, bugId);
    return this.getById(id, user);
  }

  async publish(id: string, user: AuthUser) {
    const release = await this.getById(id, user);
    if (!hasPermission(user, PERMISSIONS.RELEASE_MANAGE)) {
      throw new AppError('Insufficient permissions', 403);
    }
    return releasesRepository.update(release.id, {
      status: ReleaseStatus.RELEASED,
      releasedAt: new Date(),
    });
  }
}

export const releasesService = new ReleasesService();
