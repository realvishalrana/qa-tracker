import { NextFunction, Response } from 'express';
import { AppError } from '../common/AppError';
import { AuthenticatedRequest } from '../common/types';
import type { Permission } from '../common/permissions';

export function requirePermission(...needed: Permission[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }
    const ok = needed.some((p) => req.user!.permissions.includes(p));
    if (!ok) {
      return next(new AppError('Insufficient permissions', 403));
    }
    next();
  };
}

/** Require all listed permissions */
export function requireAllPermissions(...needed: Permission[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }
    const ok = needed.every((p) => req.user!.permissions.includes(p));
    if (!ok) {
      return next(new AppError('Insufficient permissions', 403));
    }
    next();
  };
}

export function requireAnySystemRole(...roleNames: string[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }
    const ok = roleNames.some((name) => req.user!.roles.includes(name));
    if (!ok) {
      return next(new AppError('Insufficient permissions', 403));
    }
    next();
  };
}

export function hasPermission(user: { permissions: Permission[] } | undefined, permission: Permission) {
  return !!user?.permissions.includes(permission);
}

export function isAdmin(user: { roles: string[] } | undefined) {
  return !!user?.roles.includes('Admin');
}
