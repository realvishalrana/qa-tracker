'use client';

import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { DashboardSummary } from '@/features/dashboard/components/DashboardSummary';
import type { Bug } from '@/types';

export default function DashboardPage() {
  const { summary, charts, myWork, loading, error } = useDashboard();

  if (loading) return <p className="text-slate-500">Loading dashboard...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-600">Open work, severity mix, and your assignments.</p>
      </div>
      <DashboardSummary
        total={summary?.total ?? 0}
        myOpen={summary?.myOpen ?? 0}
        byStatus={summary?.byStatus || []}
        severity={charts?.severity || []}
        assigned={(myWork?.assigned || []) as Bug[]}
      />
    </div>
  );
}
