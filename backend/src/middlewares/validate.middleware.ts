import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { sendError } from '../common/response';

export function validate(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.body = parsed.body ?? req.body;
      req.query = parsed.query ?? req.query;
      req.params = parsed.params ?? req.params;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Record<string, string[]> = {};
        for (const issue of err.issues) {
          const path = issue.path.filter((p) => p !== 'body' && p !== 'query' && p !== 'params');
          const key = path.length ? path.join('.') : issue.path.join('.') || '_form';
          fieldErrors[key] = fieldErrors[key] || [];
          fieldErrors[key].push(issue.message);
        }
        return sendError(res, 'Validation failed', 400, {
          formErrors: [],
          fieldErrors,
        });
      }
      next(err);
    }
  };
}
