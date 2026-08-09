import Link from 'next/link';
import type { Bug } from '@/types';
import type { ProjectRelease } from '@/features/projects/hooks/useProjectDetail';
import { BugList } from '@/features/bugs/components/BugList';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Form';

type ReleasesProps = {
  releases: ProjectRelease[];
  canCreate: boolean;
  onCreate: (e: React.FormEvent<HTMLFormElement>) => void;
  bugs: Bug[];
};

export function ProjectReleasesPanel({ releases, canCreate, onCreate, bugs }: ReleasesProps) {
  return (
    <>
      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold">Bugs</h2>
        <BugList bugs={bugs} />
      </section>
      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold">Releases</h2>
        <ul className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
          {releases.map((r) => (
            <li key={r.id} className="flex items-center justify-between text-sm">
              <Link href={`/releases/${r.id}`} className="font-medium text-teal-800 hover:underline">
                {r.name} ({r.version})
              </Link>
              <span className="text-slate-500">{r.status}</span>
            </li>
          ))}
          {!releases.length && <li className="text-sm text-slate-500">No releases yet.</li>}
        </ul>
        {canCreate && (
          <form onSubmit={onCreate} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-3">
            <Input name="name" placeholder="Release name" required />
            <Input name="version" placeholder="1.0.0" required />
            <Button type="submit">Create release</Button>
          </form>
        )}
      </section>
    </>
  );
}
