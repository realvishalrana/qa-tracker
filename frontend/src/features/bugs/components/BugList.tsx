import Link from 'next/link';
import { Badge } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { priorityClass, severityClass, statusClass } from '@/lib/statusStyles';
import { formatDate } from '@/lib/formatDate';
import type { Bug } from '@/types';

type BugListProps = {
  bugs: Bug[];
  onUnlink?: (bugId: string) => void;
};

export function BugList({ bugs, onUnlink }: BugListProps) {
  if (!bugs.length) {
    return <p className="text-sm text-slate-500">No bugs found.</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Key</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Feature</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Severity</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Assignee</th>
            <th className="px-4 py-3">Created</th>
            {onUnlink && <th className="px-4 py-3" />}
          </tr>
        </thead>
        <tbody>
          {bugs.map((bug) => (
            <tr key={bug.id} className="border-t border-slate-100 hover:bg-slate-50/80">
              <td className="px-4 py-3 font-mono text-xs text-teal-800">
                <Link href={`/bugs/${bug.id}`}>{bug.bugKey}</Link>
              </td>
              <td className="px-4 py-3">
                <Link href={`/bugs/${bug.id}`} className="font-medium text-slate-900 hover:text-teal-800">
                  {bug.title}
                </Link>
                <div className="text-xs text-slate-500">{bug.project?.key}</div>
              </td>
              <td className="px-4 py-3 text-slate-600">{bug.feature?.name || '—'}</td>
              <td className="px-4 py-3">
                <Badge className={statusClass[bug.status]}>{bug.status}</Badge>
              </td>
              <td className="px-4 py-3">
                <Badge className={severityClass[bug.severity]}>{bug.severity}</Badge>
              </td>
              <td className={`px-4 py-3 ${priorityClass[bug.priority]}`}>{bug.priority}</td>
              <td className="px-4 py-3 text-slate-600">{bug.assignee?.name || 'Unassigned'}</td>
              <td className="px-4 py-3 text-xs text-slate-500">{formatDate(bug.createdAt)}</td>
              {onUnlink && (
                <td className="px-4 py-3">
                  <Button type="button" variant="ghost" size="sm" onClick={() => onUnlink(bug.id)}>
                    Remove
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
