'use client';

import { useCallback, useEffect, useState } from 'react';
import { dashboardApi } from '@/features/dashboard/services/dashboardApi';

export function useDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);
  const [myWork, setMyWork] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, c, m] = await Promise.all([
        dashboardApi.summary(),
        dashboardApi.charts(),
        dashboardApi.myWork(),
      ]);
      setSummary(s.data);
      setCharts(c.data);
      setMyWork(m.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { summary, charts, myWork, loading, error, reload };
}
