import { Badge } from '@/components/ui/Form';
import { severityClass, statusClass } from '@/lib/statusStyles';
import Link from 'next/link';
import { BugList } from '@/features/bugs/components/BugList';
import type { Bug } from '@/types';

type SummaryProps = {
  total: number;
  myOpen: number;
  byStatus: Array<{ status: string; count: number }>;
  severity: Array<{ severity: string; count: number }>;
  assigned: Bug[];
};

export function DashboardSummary({ total, myOpen, byStatus, severity, assigned }: SummaryProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total bugs</p>
          <p className="mt-2 font-display text-3xl font-semibold text-teal-900">{total}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">My open</p>
          <p className="mt-2 font-display text-3xl font-semibold text-amber-700">{myOpen}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 md:col-span-2">
          <p className="mb-3 text-sm text-slate-500">By severity</p>
          <div className="flex flex-wrap gap-2">
            {severity.map((s) => (
              <Badge key={s.severity} className={severityClass[s.severity as keyof typeof severityClass]}>
                {s.severity}: {s.count}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="mb-3 text-sm text-slate-500">By status</p>
        <div className="flex flex-wrap gap-2">
          {byStatus.map((s) => (
            <Badge key={s.status} className={statusClass[s.status as keyof typeof statusClass]}>
              {s.status}: {s.count}
            </Badge>
          ))}
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Assigned to me</h2>
          <Link href="/bugs" className="text-sm font-medium text-teal-700 hover:underline">
            View all bugs
          </Link>
        </div>
        <BugList bugs={assigned} />
      </section>
    </div>
  );
}
