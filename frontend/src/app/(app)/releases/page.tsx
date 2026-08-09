'use client';

import { useReleases } from '@/features/releases/hooks/useReleases';
import { ReleaseTable } from '@/features/releases/components/ReleaseViews';

export default function ReleasesPage() {
  const { releases, loading, error } = useReleases();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-slate-900">Releases</h1>
        <p className="mt-1 text-slate-600">Track versions and linked bugs across projects.</p>
      </div>
      {loading && <p className="text-slate-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && <ReleaseTable releases={releases} />}
    </div>
  );
}
