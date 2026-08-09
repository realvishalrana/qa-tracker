'use client';

import { useCallback, useEffect, useState } from 'react';
import { bugsApi } from '@/features/bugs/services/bugsApi';
import type { Bug } from '@/types';

const DEFAULT_LIMIT = 20;

export function useBugs(filters: Record<string, string | undefined> = {}, page = 1) {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [meta, setMeta] = useState<{ total?: number; page?: number; limit?: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const filterKey = JSON.stringify({ ...filters, page });

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const parsed = JSON.parse(filterKey) as Record<string, string | undefined> & { page: number };
      const { page: p, ...rest } = parsed;
      const res = await bugsApi.list({ ...rest, page: p, limit: DEFAULT_LIMIT });
      setBugs(res.data);
      setMeta(res.meta || {});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bugs');
    } finally {
      setLoading(false);
    }
  }, [filterKey]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { bugs, meta, loading, error, reload, limit: DEFAULT_LIMIT };
}

export function useBugDetail(id: string) {
  const [bug, setBug] = useState<Bug | null>(null);
  const [timeline, setTimeline] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [bugRes, timelineRes] = await Promise.all([bugsApi.get(id), bugsApi.timeline(id)]);
      setBug(bugRes.data);
      setTimeline(timelineRes.data as unknown[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bug');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { bug, timeline, loading, error, reload };
}
