import { prisma } from '../../database/prisma';
import { permissionsForRoles } from '../../common/permissions';

const userSelect = {
  id: true,
  email: true,
  name: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  roles: {
    include: { role: { select: { id: true, name: true, description: true } } },
  },
} as const;

function mapUser<T extends { roles: Array<{ role: { id: string; name: string; description: string | null } }> }>(
  user: T
) {
  const roleNames = user.roles.map((ur) => ur.role.name);
  return {
    ...user,
    roles: user.roles.map((ur) => ur.role),
    roleNames,
    permissions: permissionsForRoles(roleNames),
  };
}

export class UsersRepository {
  async findMany(params: { q?: string; skip: number; take: number }) {
    const where = {
      deletedAt: null,
      ...(params.q
        ? {
            OR: [
              { name: { contains: params.q } },
              { email: { contains: params.q } },
            ],
          }
        : {}),
    };
    const [rows, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: userSelect,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);
    return [rows.map(mapUser), total] as const;
  }

  async findById(id: string) {
    const user = await prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: userSelect,
    });
    return user ? mapUser(user) : null;
  }

  async create(data: {
    email: string;
    passwordHash: string;
    name: string;
    roleNames: string[];
  }) {
    const roles = await prisma.role.findMany({
      where: { name: { in: data.roleNames } },
    });
    if (roles.length !== data.roleNames.length) {
      throw new Error('One or more roles not found');
    }
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        name: data.name,
        roles: { create: roles.map((r) => ({ roleId: r.id })) },
      },
      select: userSelect,
    });
    return mapUser(user);
  }

  async update(id: string, data: { name?: string; isActive?: boolean }) {
    const user = await prisma.user.update({
      where: { id },
      data,
      select: userSelect,
    });
    return mapUser(user);
  }

  async setRoles(id: string, roleNames: string[]) {
    const roles = await prisma.role.findMany({
      where: { name: { in: roleNames } },
    });
    if (roles.length !== roleNames.length) {
      throw new Error('One or more roles not found');
    }
    await prisma.$transaction([
      prisma.userRole.deleteMany({ where: { userId: id } }),
      prisma.userRole.createMany({
        data: roles.map((r) => ({ userId: id, roleId: r.id })),
      }),
    ]);
    return this.findById(id);
  }

  softDelete(id: string) {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
      select: userSelect,
    });
  }

  findByEmail(email: string) {
    return prisma.user.findFirst({ where: { email, deletedAt: null } });
  }
}

export const usersRepository = new UsersRepository();
