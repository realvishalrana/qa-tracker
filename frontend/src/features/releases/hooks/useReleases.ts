'use client';

import { useCallback, useEffect, useState } from 'react';
import { releasesApi } from '@/features/releases/services/releasesApi';
import { useProjects } from '@/features/projects/hooks/useProjects';
import { useToast } from '@/components/ui/Toast';
import { withMutationToast } from '@/lib/mutationToast';
import type { Bug, Project } from '@/types';

export type ReleaseItem = {
  id: string;
  name: string;
  version: string;
  status: string;
  notes?: string | null;
  project?: Project;
  bugs?: Bug[];
  _count?: { bugs: number };
};

export function useReleases() {
  const { projects, loading: projectsLoading } = useProjects();
  const [releases, setReleases] = useState<ReleaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!projects.length) {
      setReleases([]);
      setLoading(projectsLoading);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const all = await Promise.all(projects.map((p) => releasesApi.list(p.id)));
      setReleases(
        all.flatMap((res, idx) =>
          (res.data as ReleaseItem[]).map((r) => ({ ...r, project: projects[idx] }))
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load releases');
    } finally {
      setLoading(false);
    }
  }, [projects, projectsLoading]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { releases, loading: loading || projectsLoading, error, reload };
}

export function useReleaseDetail(id: string) {
  const toast = useToast();
  const [release, setRelease] = useState<ReleaseItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await releasesApi.get(id);
      setRelease(res.data as ReleaseItem);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load release');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const publish = useCallback(async () => {
    await withMutationToast(
      toast,
      async () => {
        await releasesApi.publish(id);
        await reload();
      },
      { success: 'Release published' }
    );
  }, [id, reload, toast]);

  const linkBugs = useCallback(
    async (bugIds: string[]) => {
      await withMutationToast(
        toast,
        async () => {
          await releasesApi.linkBugs(id, bugIds);
          await reload();
        },
        { success: `${bugIds.length} bug(s) linked to release` }
      );
    },
    [id, reload, toast]
  );

  const unlinkBug = useCallback(
    async (bugId: string) => {
      await withMutationToast(
        toast,
        async () => {
          await releasesApi.unlinkBug(id, bugId);
          await reload();
        },
        { success: 'Bug removed from release' }
      );
    },
    [id, reload, toast]
  );

  return { release, loading, error, reload, publish, linkBugs, unlinkBug };
}
