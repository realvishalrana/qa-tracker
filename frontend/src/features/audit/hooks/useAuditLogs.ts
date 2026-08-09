'use client';

import { useCallback, useEffect, useState } from 'react';
import { auditApi } from '@/features/audit/services/auditApi';

export type AuditLogItem = {
  id: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  createdAt: string;
  actor?: { email?: string } | null;
};

const DEFAULT_LIMIT = 50;

export function useAuditLogs(page = 1) {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [meta, setMeta] = useState<{ total?: number; page?: number; limit?: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await auditApi.list({ page, limit: DEFAULT_LIMIT });
      setLogs(res.data as AuditLogItem[]);
      setMeta(res.meta || {});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { logs, meta, loading, error, reload, limit: DEFAULT_LIMIT };
}
