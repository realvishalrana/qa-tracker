import { Request } from 'express';
import type { Permission } from './permissions';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: Permission[];
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}
