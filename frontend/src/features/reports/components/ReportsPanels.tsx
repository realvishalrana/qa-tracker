import { Badge } from '@/components/ui/Form';
import { severityClass, statusClass } from '@/lib/statusStyles';

type Props = {
  byStatus: Array<{ status: string; count: number }>;
  bySeverity: Array<{ severity: string; count: number }>;
  byAssignee: Array<{ assignee?: { name: string } | null; count: number }>;
  resolution: { averageHours?: number; sampleSize?: number } | null;
};

export function ReportsPanels({ byStatus, bySeverity, byAssignee, resolution }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-display text-lg font-semibold">Bugs by status</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {byStatus.map((row) => (
            <Badge key={row.status} className={statusClass[row.status as keyof typeof statusClass]}>
              {row.status}: {row.count}
            </Badge>
          ))}
        </div>
      </section>
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-display text-lg font-semibold">Bugs by severity</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {bySeverity.map((row) => (
            <Badge key={row.severity} className={severityClass[row.severity as keyof typeof severityClass]}>
              {row.severity}: {row.count}
            </Badge>
          ))}
        </div>
      </section>
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-display text-lg font-semibold">By assignee</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {byAssignee.map((row, idx) => (
            <li key={idx} className="flex justify-between">
              <span>{row.assignee?.name || 'Unassigned'}</span>
              <span className="text-slate-500">{row.count}</span>
            </li>
          ))}
          {!byAssignee.length && <li className="text-slate-500">No data or insufficient role.</li>}
        </ul>
      </section>
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-display text-lg font-semibold">Resolution time</h2>
        <p className="mt-3 font-display text-3xl font-semibold text-teal-900">
          {resolution?.averageHours ?? '—'}h
        </p>
        <p className="text-sm text-slate-500">Average across {resolution?.sampleSize ?? 0} resolved bugs</p>
      </section>
    </div>
  );
}
