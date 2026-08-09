import bcrypt from 'bcryptjs';
import { AppError } from '../../common/AppError';
import { AuthUser } from '../../common/types';
import { hasPermission, isAdmin } from '../../middlewares/rbac.middleware';
import { PERMISSIONS, SYSTEM_ROLE_NAMES } from '../../common/permissions';
import { usersRepository } from './users.repository';

export class UsersService {
  async list(q?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await usersRepository.findMany({ q, skip, take: limit });
    return { items, total, page, limit };
  }

  async getById(id: string, requester: AuthUser) {
    const canManage = hasPermission(requester, PERMISSIONS.USERS_MANAGE);
    if (!canManage && requester.id !== id) {
      throw new AppError('Insufficient permissions', 403);
    }
    const user = await usersRepository.findById(id);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async create(data: {
    email: string;
    password: string;
    name: string;
    roleNames?: string[];
  }) {
    const existing = await usersRepository.findByEmail(data.email);
    if (existing) throw new AppError('Email already registered', 409);

    const roleNames = data.roleNames?.length ? data.roleNames : ['Developer'];
    for (const name of roleNames) {
      if (!SYSTEM_ROLE_NAMES.includes(name)) {
        throw new AppError(`Unknown system role: ${name}`, 400);
      }
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    try {
      return await usersRepository.create({
        email: data.email,
        passwordHash,
        name: data.name,
        roleNames,
      });
    } catch {
      throw new AppError('Failed to create user', 400);
    }
  }

  async update(id: string, data: { name?: string; isActive?: boolean }) {
    const user = await usersRepository.findById(id);
    if (!user) throw new AppError('User not found', 404);
    return usersRepository.update(id, data);
  }

  async setRoles(id: string, roleNames: string[]) {
    const user = await usersRepository.findById(id);
    if (!user) throw new AppError('User not found', 404);
    if (!roleNames.length) throw new AppError('At least one role is required', 400);
    for (const name of roleNames) {
      if (!SYSTEM_ROLE_NAMES.includes(name)) {
        throw new AppError(`Unknown system role: ${name}`, 400);
      }
    }
    try {
      return await usersRepository.setRoles(id, roleNames);
    } catch {
      throw new AppError('Failed to update roles', 400);
    }
  }

  async remove(id: string, actor: AuthUser) {
    if (id === actor.id) throw new AppError('Cannot delete your own account', 400);
    const user = await usersRepository.findById(id);
    if (!user) throw new AppError('User not found', 404);
    if (isAdmin({ roles: user.roleNames }) && !isAdmin(actor)) {
      throw new AppError('Insufficient permissions', 403);
    }
    return usersRepository.softDelete(id);
  }
}

export const usersService = new UsersService();
