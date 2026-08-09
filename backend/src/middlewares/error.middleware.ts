import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../common/AppError';
import { sendError } from '../common/response';
import { config } from '../config';

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.details);
  }

  if (err instanceof ZodError) {
    return sendError(res, 'Validation failed', 400, err.flatten());
  }

  console.error(err);
  return sendError(
    res,
    config.isProd ? 'Internal server error' : err instanceof Error ? err.message : 'Unknown error',
    500
  );
}

export function notFoundMiddleware(_req: Request, res: Response) {
  return sendError(res, 'Route not found', 404);
}
