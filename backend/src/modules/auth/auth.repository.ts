import { prisma } from '../../database/prisma';
import { permissionsForRoles } from '../../common/permissions';

const userAuthSelect = {
  id: true,
  email: true,
  name: true,
  isActive: true,
  createdAt: true,
  roles: {
    include: { role: { select: { id: true, name: true, description: true } } },
  },
  memberships: {
    include: {
      project: { select: { id: true, name: true, key: true, status: true } },
    },
  },
} as const;

function mapUser(user: {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  roles: Array<{ role: { id: string; name: string; description: string | null } }>;
  memberships?: unknown;
}) {
  const roleNames = user.roles.map((ur) => ur.role.name);
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isActive: user.isActive,
    createdAt: user.createdAt,
    roles: user.roles.map((ur) => ur.role),
    roleNames,
    permissions: permissionsForRoles(roleNames),
    memberships: user.memberships,
  };
}

export class AuthRepository {
  findByEmail(email: string) {
    return prisma.user.findFirst({
      where: { email, deletedAt: null },
      include: {
        roles: { include: { role: true } },
      },
    });
  }

  async findById(id: string) {
    const user = await prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: userAuthSelect,
    });
    return user ? mapUser(user) : null;
  }

  async create(data: { email: string; passwordHash: string; name: string; roleName?: string }) {
    const roleName = data.roleName || 'Developer';
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) throw new Error(`Role ${roleName} not found`);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        name: data.name,
        roles: { create: [{ roleId: role.id }] },
      },
      select: userAuthSelect,
    });
    return mapUser(user);
  }

  updatePassword(id: string, passwordHash: string) {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  }
}

export const authRepository = new AuthRepository();
