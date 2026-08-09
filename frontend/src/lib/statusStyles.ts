import type { BugStatus, Priority, Severity } from '@/types';

export const statusClass: Record<BugStatus, string> = {
  NEW: 'bg-sky-100 text-sky-800',
  OPEN: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-amber-100 text-amber-900',
  RESOLVED: 'bg-emerald-100 text-emerald-800',
  VERIFIED: 'bg-teal-100 text-teal-800',
  CLOSED: 'bg-slate-200 text-slate-700',
  REOPENED: 'bg-orange-100 text-orange-800',
  BLOCKED: 'bg-rose-100 text-rose-800',
};

export const severityClass: Record<Severity, string> = {
  CRITICAL: 'bg-red-600 text-white',
  HIGH: 'bg-orange-500 text-white',
  MEDIUM: 'bg-yellow-400 text-slate-900',
  LOW: 'bg-slate-300 text-slate-800',
};

export const priorityClass: Record<Priority, string> = {
  P0: 'text-red-700 font-semibold',
  P1: 'text-orange-700 font-semibold',
  P2: 'text-amber-700',
  P3: 'text-slate-600',
};
