import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CookieOptions, Response } from 'express';
import { AppError } from '../../common/AppError';
import { config } from '../../config';
import { prisma } from '../../database/prisma';
import { authRepository } from './auth.repository';

function cookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: config.isProd,
    sameSite: config.isProd ? 'none' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

export class AuthService {
  private signToken(user: { id: string; email: string; name: string }) {
    return jwt.sign(
      { sub: user.id, email: user.email, name: user.name },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn } as jwt.SignOptions
    );
  }

  setAuthCookie(res: Response, token: string) {
    res.cookie(config.cookieName, token, cookieOptions());
  }

  clearAuthCookie(res: Response) {
    res.clearCookie(config.cookieName, {
      httpOnly: true,
      secure: config.isProd,
      sameSite: config.isProd ? 'none' : 'lax',
      path: '/',
    });
  }

  async register(input: { email: string; password: string; name: string; roleName?: string }) {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) throw new AppError('Email already registered', 409);

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await authRepository.create({
      email: input.email,
      passwordHash,
      name: input.name,
      roleName: input.roleName || 'Developer',
    });

    const token = this.signToken(user);
    return { user, token };
  }

  async login(email: string, password: string) {
    const row = await authRepository.findByEmail(email);
    if (!row) throw new AppError('Invalid credentials', 401);

    const ok = await bcrypt.compare(password, row.passwordHash);
    if (!ok) throw new AppError('Invalid credentials', 401);

    if (!row.isActive) {
      throw new AppError(
        'Your account has been deactivated. Please contact your administrator.',
        403
      );
    }

    const user = await authRepository.findById(row.id);
    if (!user) throw new AppError('Invalid credentials', 401);

    const token = this.signToken(user);
    return { user, token };
  }

  async me(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user || !user.isActive) throw new AppError('User not found', 404);
    return user;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const row = await prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });
    if (!row) throw new AppError('User not found', 404);

    const ok = await bcrypt.compare(currentPassword, row.passwordHash);
    if (!ok) throw new AppError('Current password is incorrect', 400);

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await authRepository.updatePassword(userId, passwordHash);
    return { message: 'Password updated' };
  }
}

export const authService = new AuthService();
