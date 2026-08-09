import Link from 'next/link';
import type { ReleaseItem } from '@/features/releases/hooks/useReleases';
import { ReleaseBugLinker } from '@/features/releases/components/ReleaseBugLinker';
import { BugList } from '@/features/bugs/components/BugList';
import { Button } from '@/components/ui/Button';
import type { Bug } from '@/types';

export function ReleaseTable({ releases }: { releases: ReleaseItem[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Release</th>
            <th className="px-4 py-3">Project</th>
            <th className="px-4 py-3">Version</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {releases.map((r) => (
            <tr key={r.id} className="border-t border-slate-100">
              <td className="px-4 py-3">
                <Link href={`/releases/${r.id}`} className="font-medium text-teal-800 hover:underline">
                  {r.name}
                </Link>
              </td>
              <td className="px-4 py-3">{r.project?.key}</td>
              <td className="px-4 py-3 font-mono text-xs">{r.version}</td>
              <td className="px-4 py-3">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!releases.length && (
        <p className="p-4 text-sm text-slate-500">No releases yet. Create one from a project page.</p>
      )}
    </div>
  );
}

type DetailProps = {
  release: ReleaseItem;
  canManage: boolean;
  canPublish: boolean;
  onPublish: () => void;
  onLinkBugs: (bugIds: string[]) => Promise<void>;
  onUnlinkBug: (bugId: string) => void;
};

export function ReleaseDetailView({
  release,
  canManage,
  canPublish,
  onPublish,
  onLinkBugs,
  onUnlinkBug,
}: DetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-slate-900">{release.name}</h1>
          <p className="mt-1 text-slate-600">
            {release.project?.key} · v{release.version} · {release.status}
          </p>
          <p className="mt-3 text-sm text-slate-600">{release.notes || 'No notes'}</p>
        </div>
        {canPublish && release.status !== 'RELEASED' && (
          <Button onClick={onPublish}>Publish release</Button>
        )}
      </div>
      {canManage && <ReleaseBugLinker release={release} onLink={onLinkBugs} />}
      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold">Linked bugs</h2>
        <BugList
          bugs={(release.bugs || []) as Bug[]}
          onUnlink={canManage ? onUnlinkBug : undefined}
        />
      </section>
    </div>
  );
}
