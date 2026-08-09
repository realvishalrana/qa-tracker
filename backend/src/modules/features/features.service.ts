import { Prisma } from '@prisma/client';
import { AppError } from '../../common/AppError';
import { AuthUser } from '../../common/types';
import { projectsService } from '../projects/projects.service';
import { featuresRepository } from './features.repository';

function isUniqueViolation(err: unknown) {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002';
}

export class FeaturesService {
  async list(projectId: string, user: AuthUser) {
    await projectsService.ensureAccess(projectId, user);
    return featuresRepository.listByProject(projectId);
  }

  async getById(id: string, user: AuthUser) {
    const feature = await featuresRepository.findById(id);
    if (!feature) throw new AppError('Feature not found', 404);
    await projectsService.ensureAccess(feature.projectId, user);
    return feature;
  }

  async create(projectId: string, data: { name: string; description?: string }, user: AuthUser) {
    await projectsService.ensureAccess(projectId, user);
    try {
      return await featuresRepository.create({ projectId, ...data });
    } catch (err) {
      if (isUniqueViolation(err)) {
        throw new AppError('Feature name already exists in this project', 409);
      }
      throw err;
    }
  }

  async update(id: string, data: { name?: string; description?: string }, user: AuthUser) {
    const feature = await featuresRepository.findById(id);
    if (!feature) throw new AppError('Feature not found', 404);
    await projectsService.ensureAccess(feature.projectId, user);
    try {
      return await featuresRepository.update(id, data);
    } catch (err) {
      if (isUniqueViolation(err)) {
        throw new AppError('Feature name already exists in this project', 409);
      }
      throw err;
    }
  }

  async remove(id: string, user: AuthUser) {
    const feature = await featuresRepository.findById(id);
    if (!feature) throw new AppError('Feature not found', 404);
    await projectsService.ensureAccess(feature.projectId, user);
    return featuresRepository.softDelete(id);
  }
}

export const featuresService = new FeaturesService();
