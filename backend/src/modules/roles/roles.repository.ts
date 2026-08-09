import { prisma } from '../../database/prisma';

export class RolesRepository {
  findAll() {
    return prisma.role.findMany({ orderBy: { name: 'asc' } });
  }
}

export const rolesRepository = new RolesRepository();
