export type SystemRoleName =
  | 'Admin'
  | 'Project Manager'
  | 'Developer'
  | 'QA'
  | 'Viewer';

export type ProjectRole = 'OWNER' | 'LEAD' | 'DEVELOPER' | 'QA' | 'MEMBER';

export type Permission =
  | 'project:read'
  | 'project:create'
  | 'project:update'
  | 'project:delete'
  | 'project:members:manage'
  | 'feature:create'
  | 'feature:update'
  | 'feature:delete'
  | 'bug:read'
  | 'bug:create'
  | 'bug:update'
  | 'bug:assign'
  | 'bug:status'
  | 'bug:delete'
  | 'comment:create'
  | 'attachment:upload'
  | 'release:read'
  | 'release:manage'
  | 'reports:read'
  | 'reports:export'
  | 'users:manage'
  | 'audit:read'
  | 'dashboard:read'
  | 'notifications:read';

export const PERMISSIONS = {
  PROJECT_CREATE: 'project:create',
  PROJECT_UPDATE: 'project:update',
  PROJECT_DELETE: 'project:delete',
  PROJECT_MEMBERS_MANAGE: 'project:members:manage',
  FEATURE_CREATE: 'feature:create',
  BUG_CREATE: 'bug:create',
  BUG_UPDATE: 'bug:update',
  BUG_STATUS: 'bug:status',
  COMMENT_CREATE: 'comment:create',
  ATTACHMENT_UPLOAD: 'attachment:upload',
  RELEASE_MANAGE: 'release:manage',
  REPORTS_READ: 'reports:read',
  REPORTS_EXPORT: 'reports:export',
  USERS_MANAGE: 'users:manage',
  AUDIT_READ: 'audit:read',
} as const satisfies Record<string, Permission>;

export type BugStatus =
  | 'NEW'
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'VERIFIED'
  | 'CLOSED'
  | 'REOPENED'
  | 'BLOCKED';

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type Priority = 'P0' | 'P1' | 'P2' | 'P3';
export type IssueType =
  | 'FRONTEND'
  | 'BACKEND'
  | 'API'
  | 'DATABASE'
  | 'UI'
  | 'UX'
  | 'PERFORMANCE'
  | 'SECURITY'
  | 'DEVOPS';

export interface SystemRole {
  id: string;
  name: SystemRoleName | string;
  description?: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isActive?: boolean;
  roles?: SystemRole[];
  roleNames?: string[];
  permissions?: Permission[];
  memberships?: Array<{
    projectRole: ProjectRole;
    project: { id: string; name: string; key: string; status: string };
  }>;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  description?: string | null;
  status: string;
  _count?: { bugs: number; members: number; features: number };
}

export interface Feature {
  id: string;
  projectId: string;
  name: string;
  description?: string | null;
  _count?: { bugs: number };
}

export interface Bug {
  id: string;
  bugKey: string;
  projectId: string;
  featureId?: string | null;
  title: string;
  description?: string | null;
  issueType: IssueType;
  severity: Severity;
  priority: Priority;
  status: BugStatus;
  expectedResult?: string | null;
  actualResult?: string | null;
  reproductionSteps?: string | null;
  environment?: string | null;
  buildVersion?: string | null;
  reporterId: string;
  assigneeId?: string | null;
  releaseId?: string | null;
  createdAt: string;
  updatedAt: string;
  project?: { id: string; name: string; key: string };
  feature?: { id: string; name: string } | null;
  reporter?: { id: string; name: string; email: string };
  assignee?: { id: string; name: string; email: string } | null;
  release?: { id: string; name: string; version: string } | null;
  _count?: { comments: number; attachments: number };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: { total?: number; page?: number; limit?: number };
  error?: { message: string; details?: unknown };
}

export const SYSTEM_ROLE_NAMES: SystemRoleName[] = [
  'Admin',
  'Project Manager',
  'Developer',
  'QA',
  'Viewer',
];

export const PROJECT_ROLES: ProjectRole[] = ['OWNER', 'LEAD', 'DEVELOPER', 'QA', 'MEMBER'];

export const BUG_STATUSES: BugStatus[] = [
  'NEW',
  'OPEN',
  'IN_PROGRESS',
  'RESOLVED',
  'VERIFIED',
  'CLOSED',
  'REOPENED',
  'BLOCKED',
];
export const SEVERITIES: Severity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
export const PRIORITIES: Priority[] = ['P0', 'P1', 'P2', 'P3'];
export const ISSUE_TYPES: IssueType[] = [
  'FRONTEND',
  'BACKEND',
  'API',
  'DATABASE',
  'UI',
  'UX',
  'PERFORMANCE',
  'SECURITY',
  'DEVOPS',
];
