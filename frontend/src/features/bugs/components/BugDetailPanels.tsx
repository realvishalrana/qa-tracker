import type { Bug, BugStatus } from '@/types';
import { Badge, Select } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { priorityClass, severityClass, statusClass } from '@/lib/statusStyles';
import { selectableStatuses } from '@/lib/statusTransitions';
import { formatDateTime } from '@/lib/formatDate';

type HeaderProps = { bug: Bug };

export function BugDetailHeader({ bug }: HeaderProps) {
  return (
    <div className="space-y-3">
      <p className="font-mono text-sm text-teal-700">{bug.bugKey}</p>
      <h1 className="font-display text-3xl font-semibold text-slate-900">{bug.title}</h1>
      <div className="flex flex-wrap gap-2">
        <Badge className={statusClass[bug.status]}>{bug.status}</Badge>
        <Badge className={severityClass[bug.severity]}>{bug.severity}</Badge>
        <span className={priorityClass[bug.priority]}>{bug.priority}</span>
        <Badge className="bg-slate-100 text-slate-700">{bug.issueType}</Badge>
      </div>
      <p className="text-sm text-slate-600">
        Reporter: {bug.reporter?.name} · Assignee: {bug.assignee?.name || 'Unassigned'} · Project:{' '}
        {bug.project?.key} · Feature: {bug.feature?.name || 'None'}
      </p>
      <p className="text-xs text-slate-500">
        Created {formatDateTime(bug.createdAt)} · Updated {formatDateTime(bug.updatedAt)}
      </p>
    </div>
  );
}

type DetailsProps = { bug: Bug };

export function BugDetailsPanel({ bug }: DetailsProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="font-display text-lg font-semibold">Details</h2>
      <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{bug.description || 'No description'}</p>
      <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
        <div>
          <p className="font-medium text-slate-900">Expected</p>
          <p className="text-slate-600">{bug.expectedResult || '—'}</p>
        </div>
        <div>
          <p className="font-medium text-slate-900">Actual</p>
          <p className="text-slate-600">{bug.actualResult || '—'}</p>
        </div>
        <div className="md:col-span-2">
          <p className="font-medium text-slate-900">Reproduction</p>
          <p className="whitespace-pre-wrap text-slate-600">{bug.reproductionSteps || '—'}</p>
        </div>
      </div>
    </section>
  );
}

type StatusProps = {
  currentStatus: BugStatus;
  status: BugStatus | '';
  onStatusChange: (value: BugStatus) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving?: boolean;
};

export function BugStatusForm({
  currentStatus,
  status,
  onStatusChange,
  onSubmit,
  saving,
}: StatusProps) {
  const options = selectableStatuses(currentStatus);

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="font-display text-lg font-semibold">Update status</h2>
      <Select value={status} onChange={(e) => onStatusChange(e.target.value as BugStatus)}>
        {options.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </Select>
      <p className="text-xs text-slate-500">Only valid next steps are listed.</p>
      <Button type="submit" className="w-full" disabled={saving || status === currentStatus}>
        {saving ? 'Saving...' : 'Save status'}
      </Button>
    </form>
  );
}

type TimelineEvent = {
  type: string;
  createdAt?: string;
  data: {
    field?: string;
    oldValue?: string | null;
    newValue?: string | null;
    body?: string;
    originalName?: string;
  };
};

export function BugTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="font-display text-lg font-semibold">Timeline</h2>
      <ul className="mt-3 max-h-80 space-y-2 overflow-auto text-sm">
        {events.map((event, idx) => (
          <li key={idx} className="rounded-md bg-slate-50 p-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-wide text-slate-500">{event.type}</p>
              {event.createdAt && (
                <p className="text-xs text-slate-400">{formatDateTime(event.createdAt)}</p>
              )}
            </div>
            <p className="text-slate-700">
              {event.type === 'history'
                ? `${event.data.field}: ${event.data.oldValue || '—'} → ${event.data.newValue || '—'}`
                : event.type === 'comment'
                  ? event.data.body
                  : event.data.originalName}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
