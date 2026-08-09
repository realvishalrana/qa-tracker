'use client';

import { useCallback, useEffect, useState } from 'react';
import { reportsApi } from '@/features/reports/services/reportsApi';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import { PERMISSIONS } from '@/types';

export function useReports() {
  const { hasPermission } = useAuth();
  const [byStatus, setByStatus] = useState<Array<{ status: string; count: number }>>([]);
  const [bySeverity, setBySeverity] = useState<Array<{ severity: string; count: number }>>([]);
  const [byAssignee, setByAssignee] = useState<
    Array<{ assignee?: { name: string } | null; count: number }>
  >([]);
  const [resolution, setResolution] = useState<{ averageHours?: number; sampleSize?: number } | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState<'json' | 'csv' | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, sev, a, r] = await Promise.all([
        reportsApi.byStatus(),
        reportsApi.bySeverity(),
        reportsApi.byAssignee().catch(() => ({ data: [] })),
        reportsApi.resolutionTime().catch(() => ({ data: null })),
      ]);
      setByStatus(s.data as Array<{ status: string; count: number }>);
      setBySeverity(sev.data as Array<{ severity: string; count: number }>);
      setByAssignee(a.data as Array<{ assignee?: { name: string } | null; count: number }>);
      setResolution(r.data as { averageHours?: number; sampleSize?: number } | null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const exportReport = useCallback(async (type: 'json' | 'csv') => {
    if (!hasPermission(PERMISSIONS.REPORTS_EXPORT)) return;
    setExporting(type);
    try {
      const result = await reportsApi.export(type);
      const content = type === 'csv' ? (result.data as string) : JSON.stringify(result.data, null, 2);
      const blob = new Blob([content], {
        type: type === 'csv' ? 'text/csv' : 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bugs-report.${type}`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(null);
    }
  }, [hasPermission]);

  const isEmpty =
    !byStatus.length && !bySeverity.length && !byAssignee.length && !resolution?.sampleSize;

  return {
    byStatus,
    bySeverity,
    byAssignee,
    resolution,
    loading,
    error,
    reload,
    exportReport,
    exporting,
    isEmpty,
    canExport: hasPermission(PERMISSIONS.REPORTS_EXPORT),
  };
}
