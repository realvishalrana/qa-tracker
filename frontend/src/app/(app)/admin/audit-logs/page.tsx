'use client';

import { useState } from 'react';
import { useAuditLogs } from '@/features/audit/hooks/useAuditLogs';
import { AuditLogTable } from '@/features/audit/components/AuditLogTable';
import { Pagination } from '@/components/ui/Pagination';

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const { logs, meta, loading, error, limit } = useAuditLogs(page);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-slate-900">Audit logs</h1>
        <p className="mt-1 text-slate-600">System actions for admin review.</p>
      </div>
      {loading && <p className="text-slate-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && (
        <>
          <AuditLogTable logs={logs} />
          <Pagination
            page={page}
            limit={limit}
            total={meta.total ?? logs.length}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
