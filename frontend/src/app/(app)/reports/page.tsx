'use client';

import { useReports } from '@/features/reports/hooks/useReports';
import { ReportsPanels } from '@/features/reports/components/ReportsPanels';
import { Button } from '@/components/ui/Button';

export default function ReportsPage() {
  const {
    byStatus,
    bySeverity,
    byAssignee,
    resolution,
    loading,
    error,
    exportReport,
    exporting,
    isEmpty,
    canExport,
  } = useReports();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-slate-900">Reports</h1>
          <p className="mt-1 text-slate-600">
            Live aggregates from your accessible projects — counts update as bugs change.
          </p>
        </div>
        {canExport && (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={!!exporting}
              onClick={() => void exportReport('json')}
            >
              Export JSON
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={!!exporting}
              onClick={() => void exportReport('csv')}
            >
              Export CSV
            </Button>
          </div>
        )}
      </div>
      {loading && <p className="text-slate-500">Loading reports...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && isEmpty && (
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-slate-500">
          No bug data in your accessible projects yet.
        </p>
      )}
      {!loading && !error && !isEmpty && (
        <ReportsPanels
          byStatus={byStatus}
          bySeverity={bySeverity}
          byAssignee={byAssignee}
          resolution={resolution}
        />
      )}
    </div>
  );
}
