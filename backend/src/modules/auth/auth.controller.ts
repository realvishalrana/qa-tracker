import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../common/types';
import { sendSuccess } from '../../common/response';
import { authService } from './auth.service';

export class AuthController {
  async register(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { user, token } = await authService.register(req.body);
      authService.setAuthCookie(res, token);
      return sendSuccess(res, user, 201);
    } catch (err) {
      next(err);
    }
  }

  async login(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { user, token } = await authService.login(req.body.email, req.body.password);
      authService.setAuthCookie(res, token);
      return sendSuccess(res, user);
    } catch (err) {
      next(err);
    }
  }

  async logout(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      authService.clearAuthCookie(res);
      return sendSuccess(res, { message: 'Logged out' });
    } catch (err) {
      next(err);
    }
  }

  async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.me(req.user!.id);
      return sendSuccess(res, user);
    } catch (err) {
      next(err);
    }
  }

  async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await authService.changePassword(
        req.user!.id,
        req.body.currentPassword,
        req.body.newPassword
      );
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
