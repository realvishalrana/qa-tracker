import { z } from 'zod';
import { BugStatus, IssueType, Priority, Severity } from '@prisma/client';

export const createBugSchema = z.object({
  params: z.object({ projectId: z.string() }),
  body: z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    featureId: z.string().optional().nullable(),
    issueType: z.nativeEnum(IssueType),
    severity: z.nativeEnum(Severity),
    priority: z.nativeEnum(Priority),
    expectedResult: z.string().optional(),
    actualResult: z.string().optional(),
    reproductionSteps: z.string().optional(),
    environment: z.string().optional(),
    buildVersion: z.string().optional(),
    assigneeId: z.string().optional().nullable(),
  }),
});

export const updateBugSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    featureId: z.string().optional().nullable(),
    issueType: z.nativeEnum(IssueType).optional(),
    severity: z.nativeEnum(Severity).optional(),
    priority: z.nativeEnum(Priority).optional(),
    expectedResult: z.string().optional(),
    actualResult: z.string().optional(),
    reproductionSteps: z.string().optional(),
    environment: z.string().optional(),
    buildVersion: z.string().optional(),
    assigneeId: z.string().optional().nullable(),
  }),
});

export const statusSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    status: z.nativeEnum(BugStatus),
  }),
});

export const assignSchema = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    assigneeId: z.string().nullable(),
  }),
});

export const listBugsSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    projectId: z.string().optional(),
    featureId: z.string().optional(),
    status: z.string().optional(),
    severity: z.string().optional(),
    priority: z.string().optional(),
    issueType: z.string().optional(),
    assigneeId: z.string().optional(),
    reporterId: z.string().optional(),
    releaseId: z.string().optional(),
    environment: z.string().optional(),
    buildVersion: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    sort: z.string().optional(),
  }),
});
