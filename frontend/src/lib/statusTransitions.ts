import type { BugStatus } from '@/types';

export const STATUS_TRANSITIONS: Record<BugStatus, BugStatus[]> = {
  NEW: ['OPEN', 'IN_PROGRESS', 'BLOCKED'],
  OPEN: ['IN_PROGRESS', 'BLOCKED', 'CLOSED'],
  IN_PROGRESS: ['RESOLVED', 'BLOCKED', 'OPEN'],
  RESOLVED: ['VERIFIED', 'REOPENED', 'CLOSED'],
  VERIFIED: ['CLOSED', 'REOPENED'],
  CLOSED: ['REOPENED'],
  REOPENED: ['OPEN', 'IN_PROGRESS', 'BLOCKED'],
  BLOCKED: ['OPEN', 'IN_PROGRESS'],
};

export function allowedNextStatuses(current: BugStatus): BugStatus[] {
  return STATUS_TRANSITIONS[current] || [];
}

export function selectableStatuses(current: BugStatus): BugStatus[] {
  return [current, ...allowedNextStatuses(current)];
}
