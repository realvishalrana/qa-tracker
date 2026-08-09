import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from '../common/AppError';
import { AuthenticatedRequest, AuthUser } from '../common/types';
import { permissionsForRoles } from '../common/permissions';
import { prisma } from '../database/prisma';

interface JwtPayload {
  sub: string;
  email: string;
  name: string;
}

async function loadAuthUser(userId: string): Promise<AuthUser | null> {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null, isActive: true },
    include: {
      roles: { include: { role: true } },
    },
  });
  if (!user) return null;
  const roles = user.roles.map((ur) => ur.role.name);
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    roles,
    permissions: permissionsForRoles(roles),
  };
}

export function authMiddleware(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  void (async () => {
    try {
      const cookieToken = req.cookies?.[config.cookieName] as string | undefined;
      const header = req.headers.authorization;
      const bearerToken = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
      const token = cookieToken || bearerToken;

      if (!token) {
        throw new AppError('Authentication required', 401);
      }

      const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
      const authUser = await loadAuthUser(decoded.sub);
      if (!authUser) {
        throw new AppError('Authentication required', 401);
      }
      req.user = authUser;
      next();
    } catch (err) {
      if (err instanceof AppError) return next(err);
      next(new AppError('Invalid or expired token', 401));
    }
  })();
}

export function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  void (async () => {
    try {
      const cookieToken = req.cookies?.[config.cookieName] as string | undefined;
      const header = req.headers.authorization;
      const bearerToken = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
      const token = cookieToken || bearerToken;
      if (token) {
        const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
        const authUser = await loadAuthUser(decoded.sub);
        if (authUser) req.user = authUser;
      }
    } catch {
      // ignore
    }
    next();
  })();
}
