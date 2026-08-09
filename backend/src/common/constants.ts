import { BugStatus } from '@prisma/client';

export const STATUS_TRANSITIONS: Record<BugStatus, BugStatus[]> = {
  NEW: [BugStatus.OPEN, BugStatus.IN_PROGRESS, BugStatus.BLOCKED],
  OPEN: [BugStatus.IN_PROGRESS, BugStatus.BLOCKED, BugStatus.CLOSED],
  IN_PROGRESS: [BugStatus.RESOLVED, BugStatus.BLOCKED, BugStatus.OPEN],
  RESOLVED: [BugStatus.VERIFIED, BugStatus.REOPENED, BugStatus.CLOSED],
  VERIFIED: [BugStatus.CLOSED, BugStatus.REOPENED],
  CLOSED: [BugStatus.REOPENED],
  REOPENED: [BugStatus.OPEN, BugStatus.IN_PROGRESS, BugStatus.BLOCKED],
  BLOCKED: [BugStatus.OPEN, BugStatus.IN_PROGRESS],
};
