'use client';

import { useCallback, useEffect, useState } from 'react';
import { projectsApi } from '@/features/projects/services/projectsApi';
import { useToast } from '@/components/ui/Toast';
import { withMutationToast } from '@/lib/mutationToast';
import type { Project } from '@/types';

export function useProjects() {
  const toast = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await projectsApi.list();
      setProjects(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const create = useCallback(
    async (payload: { name: string; key: string; description?: string }) => {
      await withMutationToast(
        toast,
        async () => {
          await projectsApi.create(payload);
          await reload();
        },
        { success: 'Project created' }
      );
    },
    [reload, toast]
  );

  return { projects, loading, error, reload, create };
}
