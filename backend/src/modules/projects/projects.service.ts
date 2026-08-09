import { ProjectRole, ProjectStatus } from '@prisma/client';
import { AppError } from '../../common/AppError';
import { AuthUser } from '../../common/types';
import { isAdmin } from '../../middlewares/rbac.middleware';
import { projectsRepository } from './projects.repository';

export class ProjectsService {
  async ensureAccess(projectId: string, user: AuthUser) {
    if (isAdmin(user)) return true;
    const membership = await projectsRepository.findMembership(projectId, user.id);
    if (!membership) throw new AppError('Project access denied', 403);
    return true;
  }

  async list(user: AuthUser) {
    return projectsRepository.findAccessible(user.id, isAdmin(user));
  }

  async getById(id: string, user: AuthUser) {
    await this.ensureAccess(id, user);
    const project = await projectsRepository.findById(id);
    if (!project) throw new AppError('Project not found', 404);
    return project;
  }

  async create(data: { name: string; key: string; description?: string }, user: AuthUser) {
    const existing = await projectsRepository.findByKey(data.key);
    if (existing) throw new AppError('Project key already exists', 409);

    const project = await projectsRepository.create({
      name: data.name,
      key: data.key.toUpperCase(),
      description: data.description,
    });

    await projectsRepository.addMember(project.id, user.id, ProjectRole.OWNER);
    return project;
  }

  async update(
    id: string,
    data: { name?: string; description?: string; status?: ProjectStatus },
    user: AuthUser
  ) {
    await this.ensureAccess(id, user);
    const project = await projectsRepository.findById(id);
    if (!project) throw new AppError('Project not found', 404);
    return projectsRepository.update(id, data);
  }

  async remove(id: string) {
    const project = await projectsRepository.findById(id);
    if (!project) throw new AppError('Project not found', 404);
    return projectsRepository.softDelete(id);
  }

  async listMembers(projectId: string, user: AuthUser) {
    await this.ensureAccess(projectId, user);
    return projectsRepository.listMembers(projectId);
  }

  async addMember(
    projectId: string,
    userId: string,
    projectRole: ProjectRole,
    user: AuthUser
  ) {
    await this.ensureAccess(projectId, user);
    const existing = await projectsRepository.findMembership(projectId, userId);
    if (existing) throw new AppError('User already a member', 409);
    return projectsRepository.addMember(projectId, userId, projectRole);
  }

  async updateMember(
    projectId: string,
    userId: string,
    projectRole: ProjectRole,
    user: AuthUser
  ) {
    await this.ensureAccess(projectId, user);
    const existing = await projectsRepository.findMembership(projectId, userId);
    if (!existing) throw new AppError('Member not found', 404);
    return projectsRepository.updateMember(projectId, userId, projectRole);
  }

  async removeMember(projectId: string, userId: string, user: AuthUser) {
    await this.ensureAccess(projectId, user);
    const existing = await projectsRepository.findMembership(projectId, userId);
    if (!existing) throw new AppError('Member not found', 404);
    return projectsRepository.removeMember(projectId, userId);
  }

  async activity(projectId: string, user: AuthUser) {
    await this.ensureAccess(projectId, user);
    return projectsRepository.listActivity(projectId);
  }
}

export const projectsService = new ProjectsService();
