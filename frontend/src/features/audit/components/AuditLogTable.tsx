import type { AuditLogItem } from '@/features/audit/hooks/useAuditLogs';

export function AuditLogTable({ logs }: { logs: AuditLogItem[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">When</th>
            <th className="px-4 py-3">Actor</th>
            <th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Entity</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-t border-slate-100">
              <td className="px-4 py-3 text-xs text-slate-500">
                {new Date(log.createdAt).toLocaleString()}
              </td>
              <td className="px-4 py-3">{log.actor?.email || '—'}</td>
              <td className="px-4 py-3">{log.action}</td>
              <td className="px-4 py-3">
                {log.entityType}
                {log.entityId ? `:${log.entityId.slice(0, 8)}` : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
