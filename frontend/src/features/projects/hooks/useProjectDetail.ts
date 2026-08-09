'use client';

import { useCallback, useEffect, useState } from 'react';
import { projectsApi, featuresApi, type ProjectMemberRow } from '@/features/projects/services/projectsApi';
import { bugsApi } from '@/features/bugs/services/bugsApi';
import { releasesApi } from '@/features/releases/services/releasesApi';
import { usersApi } from '@/features/users/services/usersApi';
import { useToast } from '@/components/ui/Toast';
import { withMutationToast } from '@/lib/mutationToast';
import type { Bug, Feature, Project, ProjectRole, User } from '@/types';

export type ProjectMember = ProjectMemberRow;

export type ProjectRelease = {
  id: string;
  name: string;
  version: string;
  status: string;
};

export type BugFormValues = {
  title: string;
  issueType: string;
  severity: string;
  priority: string;
  description: string;
  featureId?: string | null;
  expectedResult?: string;
  actualResult?: string;
  reproductionSteps?: string;
};

const emptyBugForm: BugFormValues = {
  title: '',
  issueType: 'FRONTEND',
  severity: 'MEDIUM',
  priority: 'P2',
  description: '',
  featureId: null,
  expectedResult: '',
  actualResult: '',
  reproductionSteps: '',
};

export function useProjectDetail(projectId: string) {
  const toast = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [releases, setReleases] = useState<ProjectRelease[]>([]);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [directory, setDirectory] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const [p, f, b, r, m] = await Promise.all([
        projectsApi.get(projectId),
        featuresApi.list(projectId),
        bugsApi.list({ projectId }),
        releasesApi.list(projectId),
        projectsApi.members(projectId),
      ]);
      setProject(p.data);
      setFeatures(f.data as Feature[]);
      setBugs(b.data);
      setReleases(r.data as ProjectRelease[]);
      setMembers(m.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const loadDirectory = useCallback(async () => {
    try {
      const res = await usersApi.list({ limit: 100 });
      setDirectory(res.data);
    } catch {
      setDirectory([]);
    }
  }, []);

  const addFeature = useCallback(
    async (name: string) => {
      await withMutationToast(
        toast,
        async () => {
          await featuresApi.create(projectId, { name });
          await reload();
        },
        { success: 'Feature added' }
      );
    },
    [projectId, reload, toast]
  );

  const createBug = useCallback(
    async (form: BugFormValues) => {
      await withMutationToast(
        toast,
        async () => {
          await bugsApi.create(projectId, {
            title: form.title,
            issueType: form.issueType,
            severity: form.severity,
            priority: form.priority,
            description: form.description || undefined,
            featureId: form.featureId || null,
            expectedResult: form.expectedResult || undefined,
            actualResult: form.actualResult || undefined,
            reproductionSteps: form.reproductionSteps || undefined,
          });
          await reload();
        },
        { success: 'Bug created' }
      );
    },
    [projectId, reload, toast]
  );

  const createRelease = useCallback(
    async (body: { name: string; version: string; notes?: string }) => {
      await withMutationToast(
        toast,
        async () => {
          await releasesApi.create(projectId, body);
          await reload();
        },
        { success: 'Release created' }
      );
    },
    [projectId, reload, toast]
  );

  const addMember = useCallback(
    async (userId: string, projectRole: ProjectRole) => {
      await withMutationToast(
        toast,
        async () => {
          await projectsApi.addMember(projectId, { userId, projectRole });
          await reload();
        },
        { success: 'Member added' }
      );
    },
    [projectId, reload, toast]
  );

  const updateMemberRole = useCallback(
    async (userId: string, projectRole: ProjectRole) => {
      await withMutationToast(
        toast,
        async () => {
          await projectsApi.updateMember(projectId, userId, projectRole);
          await reload();
        },
        { success: 'Member role updated' }
      );
    },
    [projectId, reload, toast]
  );

  return {
    project,
    features,
    bugs,
    releases,
    members,
    directory,
    loading,
    error,
    reload,
    loadDirectory,
    addFeature,
    createBug,
    createRelease,
    addMember,
    updateMemberRole,
    emptyBugForm,
  };
}
